"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = exports.SigHash = exports.SignatureHash = exports.def = exports.Decimal = exports.DEFAULT_SEQUENCE = exports.DEFAULT_LOCKTIME = exports.DEFAULT_VERSION = exports.PRECISION = void 0;
exports.cloneDeep = cloneDeep;
exports.inputBeforeSign = inputBeforeSign;
exports.PSBTCombine = PSBTCombine;
exports.bip32Path = bip32Path;
const base_1 = require("@scure/base");
const P = require("micro-packed");
const payment_js_1 = require("./payment.js");
const psbt = require("./psbt.js"); // circular
const script_js_1 = require("./script.js");
const u = require("./utils.js");
const utils_js_1 = require("./utils.js");
const utxo_js_1 = require("./utxo.js"); // circular
const EMPTY32 = new Uint8Array(32);
const EMPTY_OUTPUT = {
    amount: 0xffffffffffffffffn,
    script: P.EMPTY,
};
exports.PRECISION = 8;
exports.DEFAULT_VERSION = 2;
exports.DEFAULT_LOCKTIME = 0;
exports.DEFAULT_SEQUENCE = 4294967295;
exports.Decimal = P.coders.decimal(exports.PRECISION);
// Same as value || def, but doesn't overwrites zero ('0', 0, 0n, etc)
const def = (value, def) => (value === undefined ? def : value);
exports.def = def;
function cloneDeep(obj) {
    if (Array.isArray(obj))
        return obj.map((i) => cloneDeep(i));
    // slice of nodejs Buffer doesn't copy
    else if ((0, utils_js_1.isBytes)(obj))
        return Uint8Array.from(obj);
    // immutable
    else if (['number', 'bigint', 'boolean', 'string', 'undefined'].includes(typeof obj))
        return obj;
    // null is object
    else if (obj === null)
        return obj;
    // should be last, so it won't catch other types
    else if (typeof obj === 'object') {
        return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, cloneDeep(v)]));
    }
    throw new Error(`cloneDeep: unknown type=${obj} (${typeof obj})`);
}
/**
 * Internal, exported only for backwards-compat. Use `SigHash` instead.
 * @deprecated
 */
var SignatureHash;
(function (SignatureHash) {
    SignatureHash[SignatureHash["DEFAULT"] = 0] = "DEFAULT";
    SignatureHash[SignatureHash["ALL"] = 1] = "ALL";
    SignatureHash[SignatureHash["NONE"] = 2] = "NONE";
    SignatureHash[SignatureHash["SINGLE"] = 3] = "SINGLE";
    SignatureHash[SignatureHash["ANYONECANPAY"] = 128] = "ANYONECANPAY";
})(SignatureHash || (exports.SignatureHash = SignatureHash = {}));
var SigHash;
(function (SigHash) {
    SigHash[SigHash["DEFAULT"] = 0] = "DEFAULT";
    SigHash[SigHash["ALL"] = 1] = "ALL";
    SigHash[SigHash["NONE"] = 2] = "NONE";
    SigHash[SigHash["SINGLE"] = 3] = "SINGLE";
    SigHash[SigHash["DEFAULT_ANYONECANPAY"] = 128] = "DEFAULT_ANYONECANPAY";
    SigHash[SigHash["ALL_ANYONECANPAY"] = 129] = "ALL_ANYONECANPAY";
    SigHash[SigHash["NONE_ANYONECANPAY"] = 130] = "NONE_ANYONECANPAY";
    SigHash[SigHash["SINGLE_ANYONECANPAY"] = 131] = "SINGLE_ANYONECANPAY";
})(SigHash || (exports.SigHash = SigHash = {}));
function getTaprootKeys(privKey, pubKey, internalKey, merkleRoot = P.EMPTY) {
    if ((0, utils_js_1.equalBytes)(internalKey, pubKey)) {
        privKey = u.taprootTweakPrivKey(privKey, merkleRoot);
        pubKey = u.pubSchnorr(privKey);
    }
    return { privKey, pubKey };
}
// Force check amount/script
function outputBeforeSign(i) {
    if (i.script === undefined || i.amount === undefined)
        throw new Error('Transaction/output: script and amount required');
    return { script: i.script, amount: i.amount };
}
// Force check index/txid/sequence
function inputBeforeSign(i) {
    if (i.txid === undefined || i.index === undefined)
        throw new Error('Transaction/input: txid and index required');
    return {
        txid: i.txid,
        index: i.index,
        sequence: (0, exports.def)(i.sequence, exports.DEFAULT_SEQUENCE),
        finalScriptSig: (0, exports.def)(i.finalScriptSig, P.EMPTY),
    };
}
function cleanFinalInput(i) {
    for (const _k in i) {
        const k = _k;
        if (!psbt.PSBTInputFinalKeys.includes(k))
            delete i[k];
    }
}
// (TxHash, Idx)
const TxHashIdx = P.struct({ txid: P.bytes(32, true), index: P.U32LE });
function validateSigHash(s) {
    if (typeof s !== 'number' || typeof SigHash[s] !== 'string')
        throw new Error(`Invalid SigHash=${s}`);
    return s;
}
function unpackSighash(hashType) {
    const masked = hashType & 0b0011111;
    return {
        isAny: !!(hashType & SignatureHash.ANYONECANPAY),
        isNone: masked === SignatureHash.NONE,
        isSingle: masked === SignatureHash.SINGLE,
    };
}
function validateOpts(opts) {
    if (opts !== undefined && {}.toString.call(opts) !== '[object Object]')
        throw new Error(`Wrong object type for transaction options: ${opts}`);
    const _opts = {
        ...opts,
        // Defaults
        version: (0, exports.def)(opts.version, exports.DEFAULT_VERSION),
        lockTime: (0, exports.def)(opts.lockTime, 0),
        PSBTVersion: (0, exports.def)(opts.PSBTVersion, 0),
    };
    if (typeof _opts.allowUnknowInput !== 'undefined')
        opts.allowUnknownInputs = _opts.allowUnknowInput;
    if (typeof _opts.allowUnknowOutput !== 'undefined')
        opts.allowUnknownOutputs = _opts.allowUnknowOutput;
    // 0 and -1 happens in tests
    if (![-1, 0, 1, 2, 3].includes(_opts.version))
        throw new Error(`Unknown version: ${_opts.version}`);
    if (typeof _opts.lockTime !== 'number')
        throw new Error('Transaction lock time should be number');
    P.U32LE.encode(_opts.lockTime); // Additional range checks that lockTime
    // There is no PSBT v1, and any new version will probably have fields which we don't know how to parse, which
    // can lead to constructing broken transactions
    if (_opts.PSBTVersion !== 0 && _opts.PSBTVersion !== 2)
        throw new Error(`Unknown PSBT version ${_opts.PSBTVersion}`);
    // Flags
    for (const k of [
        'allowUnknownOutputs',
        'allowUnknownInputs',
        'disableScriptCheck',
        'bip174jsCompat',
        'allowLegacyWitnessUtxo',
        'lowR',
    ]) {
        const v = _opts[k];
        if (v === undefined)
            continue; // optional
        if (typeof v !== 'boolean')
            throw new Error(`Transation options wrong type: ${k}=${v} (${typeof v})`);
    }
    if (_opts.customScripts !== undefined) {
        const cs = _opts.customScripts;
        if (!Array.isArray(cs)) {
            throw new Error(`wrong custom scripts type (expected array): customScripts=${cs} (${typeof cs})`);
        }
        for (const s of cs) {
            if (typeof s.encode !== 'function' || typeof s.decode !== 'function')
                throw new Error(`wrong script=${s} (${typeof s})`);
            if (s.finalizeTaproot !== undefined && typeof s.finalizeTaproot !== 'function')
                throw new Error(`wrong script=${s} (${typeof s})`);
        }
    }
    return Object.freeze(_opts);
}
class Transaction {
    constructor(opts = {}) {
        this.global = {};
        this.inputs = []; // use getInput()
        this.outputs = []; // use getOutput()
        const _opts = (this.opts = validateOpts(opts));
        // Merge with global structure of PSBTv2
        if (_opts.lockTime !== exports.DEFAULT_LOCKTIME)
            this.global.fallbackLocktime = _opts.lockTime;
        this.global.txVersion = _opts.version;
    }
    // Import
    static fromRaw(raw, opts = {}) {
        const parsed = script_js_1.RawTx.decode(raw);
        const tx = new Transaction({ ...opts, version: parsed.version, lockTime: parsed.lockTime });
        for (const o of parsed.outputs)
            tx.addOutput(o);
        tx.outputs = parsed.outputs;
        tx.inputs = parsed.inputs;
        if (parsed.witnesses) {
            for (let i = 0; i < parsed.witnesses.length; i++)
                tx.inputs[i].finalScriptWitness = parsed.witnesses[i];
        }
        return tx;
    }
    // PSBT
    static fromPSBT(psbt_, opts = {}) {
        let parsed;
        try {
            parsed = psbt.RawPSBTV0.decode(psbt_);
        }
        catch (e0) {
            try {
                parsed = psbt.RawPSBTV2.decode(psbt_);
            }
            catch (e2) {
                // Throw error for v0 parsing, since it popular, otherwise it would be shadowed by v2 error
                throw e0;
            }
        }
        const PSBTVersion = parsed.global.version || 0;
        if (PSBTVersion !== 0 && PSBTVersion !== 2)
            throw new Error(`Wrong PSBT version=${PSBTVersion}`);
        const unsigned = parsed.global.unsignedTx;
        const version = PSBTVersion === 0 ? unsigned?.version : parsed.global.txVersion;
        const lockTime = PSBTVersion === 0 ? unsigned?.lockTime : parsed.global.fallbackLocktime;
        const tx = new Transaction({ ...opts, version, lockTime, PSBTVersion });
        // We need slice here, because otherwise
        const inputCount = PSBTVersion === 0 ? unsigned?.inputs.length : parsed.global.inputCount;
        tx.inputs = parsed.inputs.slice(0, inputCount).map((i, j) => ({
            finalScriptSig: P.EMPTY,
            ...parsed.global.unsignedTx?.inputs[j],
            ...i,
        }));
        const outputCount = PSBTVersion === 0 ? unsigned?.outputs.length : parsed.global.outputCount;
        tx.outputs = parsed.outputs.slice(0, outputCount).map((i, j) => ({
            ...i,
            ...parsed.global.unsignedTx?.outputs[j],
        }));
        tx.global = { ...parsed.global, txVersion: version }; // just in case proprietary/unknown fields
        if (lockTime !== exports.DEFAULT_LOCKTIME)
            tx.global.fallbackLocktime = lockTime;
        return tx;
    }
    toPSBT(PSBTVersion = this.opts.PSBTVersion) {
        if (PSBTVersion !== 0 && PSBTVersion !== 2)
            throw new Error(`Wrong PSBT version=${PSBTVersion}`);
        // if (PSBTVersion === 0 && this.inputs.length === 0) {
        //   throw new Error(
        //     'PSBT version=0 export for transaction without inputs disabled, please use version=2. Please check `toPSBT` method for explanation.'
        //   );
        // }
        const inputs = this.inputs.map((i) => psbt.cleanPSBTFields(PSBTVersion, psbt.PSBTInput, i));
        for (const inp of inputs) {
            // Don't serialize empty fields
            if (inp.partialSig && !inp.partialSig.length)
                delete inp.partialSig;
            if (inp.finalScriptSig && !inp.finalScriptSig.length)
                delete inp.finalScriptSig;
            if (inp.finalScriptWitness && !inp.finalScriptWitness.length)
                delete inp.finalScriptWitness;
        }
        const outputs = this.outputs.map((i) => psbt.cleanPSBTFields(PSBTVersion, psbt.PSBTOutput, i));
        const global = { ...this.global };
        if (PSBTVersion === 0) {
            /*
            - Bitcoin raw transaction expects to have at least 1 input because it uses case with zero inputs as marker for SegWit
            - this means we cannot serialize raw tx with zero inputs since it will be parsed as SegWit tx
            - Parsing of PSBTv0 depends on unsignedTx (it looks for input count here)
            - BIP-174 requires old serialization format (without witnesses) inside global, which solves this
            */
            global.unsignedTx = script_js_1.RawOldTx.decode(script_js_1.RawOldTx.encode({
                version: this.version,
                lockTime: this.lockTime,
                inputs: this.inputs.map(inputBeforeSign).map((i) => ({
                    ...i,
                    finalScriptSig: P.EMPTY,
                })),
                outputs: this.outputs.map(outputBeforeSign),
            }));
            delete global.fallbackLocktime;
            delete global.txVersion;
        }
        else {
            global.version = PSBTVersion;
            global.txVersion = this.version;
            global.inputCount = this.inputs.length;
            global.outputCount = this.outputs.length;
            if (global.fallbackLocktime && global.fallbackLocktime === exports.DEFAULT_LOCKTIME)
                delete global.fallbackLocktime;
        }
        if (this.opts.bip174jsCompat) {
            if (!inputs.length)
                inputs.push({});
            if (!outputs.length)
                outputs.push({});
        }
        return (PSBTVersion === 0 ? psbt.RawPSBTV0 : psbt.RawPSBTV2).encode({
            global,
            inputs,
            outputs,
        });
    }
    // BIP370 lockTime (https://github.com/bitcoin/bips/blob/master/bip-0370.mediawiki#determining-lock-time)
    get lockTime() {
        let height = exports.DEFAULT_LOCKTIME;
        let heightCnt = 0;
        let time = exports.DEFAULT_LOCKTIME;
        let timeCnt = 0;
        for (const i of this.inputs) {
            if (i.requiredHeightLocktime) {
                height = Math.max(height, i.requiredHeightLocktime);
                heightCnt++;
            }
            if (i.requiredTimeLocktime) {
                time = Math.max(time, i.requiredTimeLocktime);
                timeCnt++;
            }
        }
        if (heightCnt && heightCnt >= timeCnt)
            return height;
        if (time !== exports.DEFAULT_LOCKTIME)
            return time;
        return this.global.fallbackLocktime || exports.DEFAULT_LOCKTIME;
    }
    get version() {
        // Should be not possible
        if (this.global.txVersion === undefined)
            throw new Error('No global.txVersion');
        return this.global.txVersion;
    }
    inputStatus(idx) {
        this.checkInputIdx(idx);
        const input = this.inputs[idx];
        // Finalized
        if (input.finalScriptSig && input.finalScriptSig.length)
            return 'finalized';
        if (input.finalScriptWitness && input.finalScriptWitness.length)
            return 'finalized';
        // Signed taproot
        if (input.tapKeySig)
            return 'signed';
        if (input.tapScriptSig && input.tapScriptSig.length)
            return 'signed';
        // Signed
        if (input.partialSig && input.partialSig.length)
            return 'signed';
        return 'unsigned';
    }
    // Cannot replace unpackSighash, tests rely on very generic implemenetation with signing inputs outside of range
    // We will lose some vectors -> smaller test coverage of preimages (very important!)
    inputSighash(idx) {
        this.checkInputIdx(idx);
        const inputSighash = this.inputs[idx].sighashType;
        const sighash = inputSighash === undefined ? SignatureHash.DEFAULT : inputSighash;
        // ALL or DEFAULT -- everything signed
        // NONE           -- all inputs + no outputs
        // SINGLE         -- all inputs + output with same index
        // ALL + ANYONE   -- specific input + all outputs
        // NONE + ANYONE  -- specific input + no outputs
        // SINGLE         -- specific inputs + output with same index
        const sigOutputs = sighash === SignatureHash.DEFAULT ? SignatureHash.ALL : sighash & 0b11;
        const sigInputs = sighash & SignatureHash.ANYONECANPAY;
        return { sigInputs, sigOutputs };
    }
    // Very nice for debug purposes, but slow. If there is too much inputs/outputs to add, will be quadratic.
    // Some cache will be nice, but there chance to have bugs with cache invalidation
    signStatus() {
        // if addInput or addOutput is not possible, then all inputs or outputs are signed
        let addInput = true, addOutput = true;
        let inputs = [], outputs = [];
        for (let idx = 0; idx < this.inputs.length; idx++) {
            const status = this.inputStatus(idx);
            // Unsigned input doesn't affect anything
            if (status === 'unsigned')
                continue;
            const { sigInputs, sigOutputs } = this.inputSighash(idx);
            // Input type
            if (sigInputs === SignatureHash.ANYONECANPAY)
                inputs.push(idx);
            else
                addInput = false;
            // Output type
            if (sigOutputs === SignatureHash.ALL)
                addOutput = false;
            else if (sigOutputs === SignatureHash.SINGLE)
                outputs.push(idx);
            else if (sigOutputs === SignatureHash.NONE) {
                // Doesn't affect any outputs at all
            }
            else
                throw new Error(`Wrong signature hash output type: ${sigOutputs}`);
        }
        return { addInput, addOutput, inputs, outputs };
    }
    get isFinal() {
        for (let idx = 0; idx < this.inputs.length; idx++)
            if (this.inputStatus(idx) !== 'finalized')
                return false;
        return true;
    }
    // Info utils
    get hasWitnesses() {
        let out = false;
        for (const i of this.inputs)
            if (i.finalScriptWitness && i.finalScriptWitness.length)
                out = true;
        return out;
    }
    // https://en.bitcoin.it/wiki/Weight_units
    get weight() {
        if (!this.isFinal)
            throw new Error('Transaction is not finalized');
        let out = 32;
        // Outputs
        const outputs = this.outputs.map(outputBeforeSign);
        out += 4 * script_js_1.CompactSizeLen.encode(this.outputs.length).length;
        for (const o of outputs)
            out += 32 + 4 * script_js_1.VarBytes.encode(o.script).length;
        // Inputs
        if (this.hasWitnesses)
            out += 2;
        out += 4 * script_js_1.CompactSizeLen.encode(this.inputs.length).length;
        for (const i of this.inputs) {
            out += 160 + 4 * script_js_1.VarBytes.encode(i.finalScriptSig || P.EMPTY).length;
            if (this.hasWitnesses && i.finalScriptWitness)
                out += script_js_1.RawWitness.encode(i.finalScriptWitness).length;
        }
        return out;
    }
    get vsize() {
        return (0, utxo_js_1.toVsize)(this.weight);
    }
    toBytes(withScriptSig = false, withWitness = false) {
        return script_js_1.RawTx.encode({
            version: this.version,
            lockTime: this.lockTime,
            inputs: this.inputs.map(inputBeforeSign).map((i) => ({
                ...i,
                finalScriptSig: (withScriptSig && i.finalScriptSig) || P.EMPTY,
            })),
            outputs: this.outputs.map(outputBeforeSign),
            witnesses: this.inputs.map((i) => i.finalScriptWitness || []),
            segwitFlag: withWitness && this.hasWitnesses,
        });
    }
    get unsignedTx() {
        return this.toBytes(false, false);
    }
    get hex() {
        return base_1.hex.encode(this.toBytes(true, this.hasWitnesses));
    }
    get hash() {
        if (!this.isFinal)
            throw new Error('Transaction is not finalized');
        return base_1.hex.encode(u.sha256x2(this.toBytes(true)));
    }
    get id() {
        if (!this.isFinal)
            throw new Error('Transaction is not finalized');
        return base_1.hex.encode(u.sha256x2(this.toBytes(true)).reverse());
    }
    // Input stuff
    checkInputIdx(idx) {
        if (!Number.isSafeInteger(idx) || 0 > idx || idx >= this.inputs.length)
            throw new Error(`Wrong input index=${idx}`);
    }
    getInput(idx) {
        this.checkInputIdx(idx);
        return cloneDeep(this.inputs[idx]);
    }
    get inputsLength() {
        return this.inputs.length;
    }
    // Modification
    addInput(input, _ignoreSignStatus = false) {
        if (!_ignoreSignStatus && !this.signStatus().addInput)
            throw new Error('Tx has signed inputs, cannot add new one');
        this.inputs.push((0, utxo_js_1.normalizeInput)(input, undefined, undefined, this.opts.disableScriptCheck));
        return this.inputs.length - 1;
    }
    updateInput(idx, input, _ignoreSignStatus = false) {
        this.checkInputIdx(idx);
        let allowedFields = undefined;
        if (!_ignoreSignStatus) {
            const status = this.signStatus();
            if (!status.addInput || status.inputs.includes(idx))
                allowedFields = psbt.PSBTInputUnsignedKeys;
        }
        this.inputs[idx] = (0, utxo_js_1.normalizeInput)(input, this.inputs[idx], allowedFields, this.opts.disableScriptCheck, this.opts.allowUnknown);
    }
    // Output stuff
    checkOutputIdx(idx) {
        if (!Number.isSafeInteger(idx) || 0 > idx || idx >= this.outputs.length)
            throw new Error(`Wrong output index=${idx}`);
    }
    getOutput(idx) {
        this.checkOutputIdx(idx);
        return cloneDeep(this.outputs[idx]);
    }
    getOutputAddress(idx, network = utils_js_1.NETWORK) {
        const out = this.getOutput(idx);
        if (!out.script)
            return;
        return (0, payment_js_1.Address)(network).encode(payment_js_1.OutScript.decode(out.script));
    }
    get outputsLength() {
        return this.outputs.length;
    }
    normalizeOutput(o, cur, allowedFields) {
        let { amount, script } = o;
        if (amount === undefined)
            amount = cur?.amount;
        if (typeof amount !== 'bigint')
            throw new Error(`Wrong amount type, should be of type bigint in sats, but got ${amount} of type ${typeof amount}`);
        if (typeof script === 'string')
            script = base_1.hex.decode(script);
        if (script === undefined)
            script = cur?.script;
        let res = { ...cur, ...o, amount, script };
        if (res.amount === undefined)
            delete res.amount;
        res = psbt.mergeKeyMap(psbt.PSBTOutput, res, cur, allowedFields, this.opts.allowUnknown);
        psbt.PSBTOutputCoder.encode(res);
        if (res.script &&
            !this.opts.allowUnknownOutputs &&
            payment_js_1.OutScript.decode(res.script).type === 'unknown') {
            throw new Error('Transaction/output: unknown output script type, there is a chance that input is unspendable. Pass allowUnknownOutputs=true, if you sure');
        }
        if (!this.opts.disableScriptCheck)
            (0, payment_js_1.checkScript)(res.script, res.redeemScript, res.witnessScript);
        return res;
    }
    addOutput(o, _ignoreSignStatus = false) {
        if (!_ignoreSignStatus && !this.signStatus().addOutput)
            throw new Error('Tx has signed outputs, cannot add new one');
        this.outputs.push(this.normalizeOutput(o));
        return this.outputs.length - 1;
    }
    updateOutput(idx, output, _ignoreSignStatus = false) {
        this.checkOutputIdx(idx);
        let allowedFields = undefined;
        if (!_ignoreSignStatus) {
            const status = this.signStatus();
            if (!status.addOutput || status.outputs.includes(idx))
                allowedFields = psbt.PSBTOutputUnsignedKeys;
        }
        this.outputs[idx] = this.normalizeOutput(output, this.outputs[idx], allowedFields);
    }
    addOutputAddress(address, amount, network = utils_js_1.NETWORK) {
        return this.addOutput({ script: payment_js_1.OutScript.encode((0, payment_js_1.Address)(network).decode(address)), amount });
    }
    // Utils
    get fee() {
        let res = 0n;
        for (const i of this.inputs) {
            const prevOut = (0, utxo_js_1.getPrevOut)(i);
            if (!prevOut)
                throw new Error('Empty input amount');
            res += prevOut.amount;
        }
        const outputs = this.outputs.map(outputBeforeSign);
        for (const o of outputs)
            res -= o.amount;
        return res;
    }
    // Signing
    // Based on https://github.com/bitcoin/bitcoin/blob/5871b5b5ab57a0caf9b7514eb162c491c83281d5/test/functional/test_framework/script.py#L624
    // There is optimization opportunity to re-use hashes for multiple inputs for witness v0/v1,
    // but we are trying to be less complicated for audit purpose for now.
    preimageLegacy(idx, prevOutScript, hashType) {
        const { isAny, isNone, isSingle } = unpackSighash(hashType);
        if (idx < 0 || !Number.isSafeInteger(idx))
            throw new Error(`Invalid input idx=${idx}`);
        if ((isSingle && idx >= this.outputs.length) || idx >= this.inputs.length)
            return P.U256BE.encode(1n);
        prevOutScript = script_js_1.Script.encode(script_js_1.Script.decode(prevOutScript).filter((i) => i !== 'CODESEPARATOR'));
        let inputs = this.inputs
            .map(inputBeforeSign)
            .map((input, inputIdx) => ({
            ...input,
            finalScriptSig: inputIdx === idx ? prevOutScript : P.EMPTY,
        }));
        if (isAny)
            inputs = [inputs[idx]];
        else if (isNone || isSingle) {
            inputs = inputs.map((input, inputIdx) => ({
                ...input,
                sequence: inputIdx === idx ? input.sequence : 0,
            }));
        }
        let outputs = this.outputs.map(outputBeforeSign);
        if (isNone)
            outputs = [];
        else if (isSingle) {
            outputs = outputs.slice(0, idx).fill(EMPTY_OUTPUT).concat([outputs[idx]]);
        }
        const tmpTx = script_js_1.RawTx.encode({
            lockTime: this.lockTime,
            version: this.version,
            segwitFlag: false,
            inputs,
            outputs,
        });
        return u.sha256x2(tmpTx, P.I32LE.encode(hashType));
    }
    preimageWitnessV0(idx, prevOutScript, hashType, amount) {
        const { isAny, isNone, isSingle } = unpackSighash(hashType);
        let inputHash = EMPTY32;
        let sequenceHash = EMPTY32;
        let outputHash = EMPTY32;
        const inputs = this.inputs.map(inputBeforeSign);
        const outputs = this.outputs.map(outputBeforeSign);
        if (!isAny)
            inputHash = u.sha256x2(...inputs.map(TxHashIdx.encode));
        if (!isAny && !isSingle && !isNone)
            sequenceHash = u.sha256x2(...inputs.map((i) => P.U32LE.encode(i.sequence)));
        if (!isSingle && !isNone) {
            outputHash = u.sha256x2(...outputs.map(script_js_1.RawOutput.encode));
        }
        else if (isSingle && idx < outputs.length)
            outputHash = u.sha256x2(script_js_1.RawOutput.encode(outputs[idx]));
        const input = inputs[idx];
        return u.sha256x2(P.I32LE.encode(this.version), inputHash, sequenceHash, P.bytes(32, true).encode(input.txid), P.U32LE.encode(input.index), script_js_1.VarBytes.encode(prevOutScript), P.U64LE.encode(amount), P.U32LE.encode(input.sequence), outputHash, P.U32LE.encode(this.lockTime), P.U32LE.encode(hashType));
    }
    preimageWitnessV1(idx, prevOutScript, hashType, amount, codeSeparator = -1, leafScript, leafVer = 0xc0, annex) {
        if (!Array.isArray(amount) || this.inputs.length !== amount.length)
            throw new Error(`Invalid amounts array=${amount}`);
        if (!Array.isArray(prevOutScript) || this.inputs.length !== prevOutScript.length)
            throw new Error(`Invalid prevOutScript array=${prevOutScript}`);
        const out = [
            P.U8.encode(0),
            P.U8.encode(hashType), // U8 sigHash
            P.I32LE.encode(this.version),
            P.U32LE.encode(this.lockTime),
        ];
        const outType = hashType === SignatureHash.DEFAULT ? SignatureHash.ALL : hashType & 0b11;
        const inType = hashType & SignatureHash.ANYONECANPAY;
        const inputs = this.inputs.map(inputBeforeSign);
        const outputs = this.outputs.map(outputBeforeSign);
        if (inType !== SignatureHash.ANYONECANPAY) {
            out.push(...[
                inputs.map(TxHashIdx.encode),
                amount.map(P.U64LE.encode),
                prevOutScript.map(script_js_1.VarBytes.encode),
                inputs.map((i) => P.U32LE.encode(i.sequence)),
            ].map((i) => u.sha256((0, utils_js_1.concatBytes)(...i))));
        }
        if (outType === SignatureHash.ALL) {
            out.push(u.sha256((0, utils_js_1.concatBytes)(...outputs.map(script_js_1.RawOutput.encode))));
        }
        const spendType = (annex ? 1 : 0) | (leafScript ? 2 : 0);
        out.push(new Uint8Array([spendType]));
        if (inType === SignatureHash.ANYONECANPAY) {
            const inp = inputs[idx];
            out.push(TxHashIdx.encode(inp), P.U64LE.encode(amount[idx]), script_js_1.VarBytes.encode(prevOutScript[idx]), P.U32LE.encode(inp.sequence));
        }
        else
            out.push(P.U32LE.encode(idx));
        if (spendType & 1)
            out.push(u.sha256(script_js_1.VarBytes.encode(annex || P.EMPTY)));
        if (outType === SignatureHash.SINGLE)
            out.push(idx < outputs.length ? u.sha256(script_js_1.RawOutput.encode(outputs[idx])) : EMPTY32);
        if (leafScript)
            out.push((0, payment_js_1.tapLeafHash)(leafScript, leafVer), P.U8.encode(0), P.I32LE.encode(codeSeparator));
        return u.tagSchnorr('TapSighash', ...out);
    }
    // Signer can be privateKey OR instance of bip32 HD stuff
    signIdx(privateKey, idx, allowedSighash, _auxRand) {
        this.checkInputIdx(idx);
        const input = this.inputs[idx];
        const inputType = (0, utxo_js_1.getInputType)(input, this.opts.allowLegacyWitnessUtxo);
        // Handle BIP32 HDKey
        if (!(0, utils_js_1.isBytes)(privateKey)) {
            if (!input.bip32Derivation || !input.bip32Derivation.length)
                throw new Error('bip32Derivation: empty');
            const signers = input.bip32Derivation
                .filter((i) => i[1].fingerprint == privateKey.fingerprint)
                .map(([pubKey, { path }]) => {
                let s = privateKey;
                for (const i of path)
                    s = s.deriveChild(i);
                if (!(0, utils_js_1.equalBytes)(s.publicKey, pubKey))
                    throw new Error('bip32Derivation: wrong pubKey');
                if (!s.privateKey)
                    throw new Error('bip32Derivation: no privateKey');
                return s;
            });
            if (!signers.length)
                throw new Error(`bip32Derivation: no items with fingerprint=${privateKey.fingerprint}`);
            let signed = false;
            for (const s of signers)
                if (this.signIdx(s.privateKey, idx))
                    signed = true;
            return signed;
        }
        // Sighash checks
        // Just for compat with bitcoinjs-lib, so users won't face unexpected behaviour.
        if (!allowedSighash)
            allowedSighash = [inputType.defaultSighash];
        else
            allowedSighash.forEach(validateSigHash);
        const sighash = inputType.sighash;
        if (!allowedSighash.includes(sighash)) {
            throw new Error(`Input with not allowed sigHash=${sighash}. Allowed: ${allowedSighash.join(', ')}`);
        }
        // It is possible to sign these inputs for legacy/segwit v0 (but no taproot!),
        // however this was because of bug in bitcoin-core, which remains here because of consensus.
        // If this is absolutely neccessary for your case, please open issue.
        // We disable it to avoid complicated workflow where SINGLE will block adding new outputs
        const { sigOutputs } = this.inputSighash(idx);
        if (sigOutputs === SignatureHash.SINGLE && idx >= this.outputs.length) {
            throw new Error(`Input with sighash SINGLE, but there is no output with corresponding index=${idx}`);
        }
        // Actual signing
        // Taproot
        const prevOut = (0, utxo_js_1.getPrevOut)(input);
        if (inputType.txType === 'taproot') {
            const prevOuts = this.inputs.map(utxo_js_1.getPrevOut);
            const prevOutScript = prevOuts.map((i) => i.script);
            const amount = prevOuts.map((i) => i.amount);
            let signed = false;
            let schnorrPub = u.pubSchnorr(privateKey);
            let merkleRoot = input.tapMerkleRoot || P.EMPTY;
            if (input.tapInternalKey) {
                // internal + tweak = tweaked key
                // if internal key == current public key, we need to tweak private key,
                // otherwise sign as is. bitcoinjs implementation always wants tweaked
                // priv key to be provided
                const { pubKey, privKey } = getTaprootKeys(privateKey, schnorrPub, input.tapInternalKey, merkleRoot);
                const [taprootPubKey, _] = u.taprootTweakPubkey(input.tapInternalKey, merkleRoot);
                if ((0, utils_js_1.equalBytes)(taprootPubKey, pubKey)) {
                    const hash = this.preimageWitnessV1(idx, prevOutScript, sighash, amount);
                    const sig = (0, utils_js_1.concatBytes)(u.signSchnorr(hash, privKey, _auxRand), sighash !== SignatureHash.DEFAULT ? new Uint8Array([sighash]) : P.EMPTY);
                    this.updateInput(idx, { tapKeySig: sig }, true);
                    signed = true;
                }
            }
            if (input.tapLeafScript) {
                input.tapScriptSig = input.tapScriptSig || [];
                for (const [_, _script] of input.tapLeafScript) {
                    const script = _script.subarray(0, -1);
                    const scriptDecoded = script_js_1.Script.decode(script);
                    const ver = _script[_script.length - 1];
                    const hash = (0, payment_js_1.tapLeafHash)(script, ver);
                    // NOTE: no need to tweak internal key here, since we don't support nested p2tr
                    const pos = scriptDecoded.findIndex((i) => (0, utils_js_1.isBytes)(i) && (0, utils_js_1.equalBytes)(i, schnorrPub));
                    // Skip if there is no public key in tapLeafScript
                    if (pos === -1)
                        continue;
                    const msg = this.preimageWitnessV1(idx, prevOutScript, sighash, amount, undefined, script, ver);
                    const sig = (0, utils_js_1.concatBytes)(u.signSchnorr(msg, privateKey, _auxRand), sighash !== SignatureHash.DEFAULT ? new Uint8Array([sighash]) : P.EMPTY);
                    this.updateInput(idx, { tapScriptSig: [[{ pubKey: schnorrPub, leafHash: hash }, sig]] }, true);
                    signed = true;
                }
            }
            if (!signed)
                throw new Error('No taproot scripts signed');
            return true;
        }
        else {
            // only compressed keys are supported for now
            const pubKey = u.pubECDSA(privateKey);
            // TODO: replace with explicit checks
            // Check if script has public key or its has inside
            let hasPubkey = false;
            const pubKeyHash = u.hash160(pubKey);
            for (const i of script_js_1.Script.decode(inputType.lastScript)) {
                if ((0, utils_js_1.isBytes)(i) && ((0, utils_js_1.equalBytes)(i, pubKey) || (0, utils_js_1.equalBytes)(i, pubKeyHash)))
                    hasPubkey = true;
            }
            if (!hasPubkey)
                throw new Error(`Input script doesn't have pubKey: ${inputType.lastScript}`);
            let hash;
            if (inputType.txType === 'legacy') {
                hash = this.preimageLegacy(idx, inputType.lastScript, sighash);
            }
            else if (inputType.txType === 'segwit') {
                let script = inputType.lastScript;
                // If wpkh OR sh-wpkh, wsh-wpkh is impossible, so looks ok
                if (inputType.last.type === 'wpkh')
                    script = payment_js_1.OutScript.encode({ type: 'pkh', hash: inputType.last.hash });
                hash = this.preimageWitnessV0(idx, script, sighash, prevOut.amount);
            }
            else
                throw new Error(`Transaction/sign: unknown tx type: ${inputType.txType}`);
            const sig = u.signECDSA(hash, privateKey, this.opts.lowR);
            this.updateInput(idx, {
                partialSig: [[pubKey, (0, utils_js_1.concatBytes)(sig, new Uint8Array([sighash]))]],
            }, true);
        }
        return true;
    }
    // This is bad API. Will work if user creates and signs tx, but if
    // there is some complex workflow with exchanging PSBT and signing them,
    // then it is better to validate which output user signs. How could a better API look like?
    // Example: user adds input, sends to another party, then signs received input (mixer etc),
    // another user can add different input for same key and user will sign it.
    // Even worse: another user can add bip32 derivation, and spend money from different address.
    // Better api: signIdx
    sign(privateKey, allowedSighash, _auxRand) {
        let num = 0;
        for (let i = 0; i < this.inputs.length; i++) {
            try {
                if (this.signIdx(privateKey, i, allowedSighash, _auxRand))
                    num++;
            }
            catch (e) { }
        }
        if (!num)
            throw new Error('No inputs signed');
        return num;
    }
    finalizeIdx(idx) {
        this.checkInputIdx(idx);
        if (this.fee < 0n)
            throw new Error('Outputs spends more than inputs amount');
        const input = this.inputs[idx];
        const inputType = (0, utxo_js_1.getInputType)(input, this.opts.allowLegacyWitnessUtxo);
        // Taproot finalize
        if (inputType.txType === 'taproot') {
            if (input.tapKeySig)
                input.finalScriptWitness = [input.tapKeySig];
            else if (input.tapLeafScript && input.tapScriptSig) {
                // Sort leafs by control block length.
                const leafs = input.tapLeafScript.sort((a, b) => psbt.TaprootControlBlock.encode(a[0]).length -
                    psbt.TaprootControlBlock.encode(b[0]).length);
                for (const [cb, _script] of leafs) {
                    // Last byte is version
                    const script = _script.slice(0, -1);
                    const ver = _script[_script.length - 1];
                    const outScript = payment_js_1.OutScript.decode(script);
                    const hash = (0, payment_js_1.tapLeafHash)(script, ver);
                    const scriptSig = input.tapScriptSig.filter((i) => (0, utils_js_1.equalBytes)(i[0].leafHash, hash));
                    let signatures = [];
                    if (outScript.type === 'tr_ms') {
                        const m = outScript.m;
                        const pubkeys = outScript.pubkeys;
                        let added = 0;
                        for (const pub of pubkeys) {
                            const sigIdx = scriptSig.findIndex((i) => (0, utils_js_1.equalBytes)(i[0].pubKey, pub));
                            // Should have exact amount of signatures (more -- will fail)
                            if (added === m || sigIdx === -1) {
                                signatures.push(P.EMPTY);
                                continue;
                            }
                            signatures.push(scriptSig[sigIdx][1]);
                            added++;
                        }
                        // Should be exact same as m
                        if (added !== m)
                            continue;
                    }
                    else if (outScript.type === 'tr_ns') {
                        for (const pub of outScript.pubkeys) {
                            const sigIdx = scriptSig.findIndex((i) => (0, utils_js_1.equalBytes)(i[0].pubKey, pub));
                            if (sigIdx === -1)
                                continue;
                            signatures.push(scriptSig[sigIdx][1]);
                        }
                        if (signatures.length !== outScript.pubkeys.length)
                            continue;
                    }
                    else if (outScript.type === 'unknown' && this.opts.allowUnknownInputs) {
                        // Trying our best to sign what we can
                        const scriptDecoded = script_js_1.Script.decode(script);
                        signatures = scriptSig
                            .map(([{ pubKey }, signature]) => {
                            const pos = scriptDecoded.findIndex((i) => (0, utils_js_1.isBytes)(i) && (0, utils_js_1.equalBytes)(i, pubKey));
                            if (pos === -1)
                                throw new Error('finalize/taproot: cannot find position of pubkey in script');
                            return { signature, pos };
                        })
                            // Reverse order (because witness is stack and we take last element first from it)
                            .sort((a, b) => a.pos - b.pos)
                            .map((i) => i.signature);
                        if (!signatures.length)
                            continue;
                    }
                    else {
                        const custom = this.opts.customScripts;
                        if (custom) {
                            for (const c of custom) {
                                if (!c.finalizeTaproot)
                                    continue;
                                const scriptDecoded = script_js_1.Script.decode(script);
                                const csEncoded = c.encode(scriptDecoded);
                                if (csEncoded === undefined)
                                    continue;
                                const finalized = c.finalizeTaproot(script, csEncoded, scriptSig);
                                if (!finalized)
                                    continue;
                                input.finalScriptWitness = finalized.concat(psbt.TaprootControlBlock.encode(cb));
                                input.finalScriptSig = P.EMPTY;
                                cleanFinalInput(input);
                                return;
                            }
                        }
                        throw new Error('Finalize: Unknown tapLeafScript');
                    }
                    // Witness is stack, so last element will be used first
                    input.finalScriptWitness = signatures
                        .reverse()
                        .concat([script, psbt.TaprootControlBlock.encode(cb)]);
                    break;
                }
                if (!input.finalScriptWitness)
                    throw new Error('finalize/taproot: empty witness');
            }
            else
                throw new Error('finalize/taproot: unknown input');
            input.finalScriptSig = P.EMPTY;
            cleanFinalInput(input);
            return;
        }
        if (!input.partialSig || !input.partialSig.length)
            throw new Error('Not enough partial sign');
        let inputScript = P.EMPTY;
        let witness = [];
        // TODO: move input scripts closer to payments/output scripts
        // Multisig
        if (inputType.last.type === 'ms') {
            const m = inputType.last.m;
            const pubkeys = inputType.last.pubkeys;
            let signatures = [];
            // partial: [pubkey, sign]
            for (const pub of pubkeys) {
                const sign = input.partialSig.find((s) => (0, utils_js_1.equalBytes)(pub, s[0]));
                if (!sign)
                    continue;
                signatures.push(sign[1]);
            }
            signatures = signatures.slice(0, m);
            if (signatures.length !== m) {
                throw new Error(`Multisig: wrong signatures count, m=${m} n=${pubkeys.length} signatures=${signatures.length}`);
            }
            inputScript = script_js_1.Script.encode([0, ...signatures]);
        }
        else if (inputType.last.type === 'pk') {
            inputScript = script_js_1.Script.encode([input.partialSig[0][1]]);
        }
        else if (inputType.last.type === 'pkh') {
            inputScript = script_js_1.Script.encode([input.partialSig[0][1], input.partialSig[0][0]]);
        }
        else if (inputType.last.type === 'wpkh') {
            inputScript = P.EMPTY;
            witness = [input.partialSig[0][1], input.partialSig[0][0]];
        }
        else if (inputType.last.type === 'unknown' && !this.opts.allowUnknownInputs)
            throw new Error('Unknown inputs not allowed');
        // Create final scripts (generic part)
        let finalScriptSig, finalScriptWitness;
        if (inputType.type.includes('wsh-')) {
            // P2WSH
            if (inputScript.length && inputType.lastScript.length) {
                witness = script_js_1.Script.decode(inputScript).map((i) => {
                    if (i === 0)
                        return P.EMPTY;
                    if ((0, utils_js_1.isBytes)(i))
                        return i;
                    throw new Error(`Wrong witness op=${i}`);
                });
            }
            witness = witness.concat(inputType.lastScript);
        }
        if (inputType.txType === 'segwit')
            finalScriptWitness = witness;
        if (inputType.type.startsWith('sh-wsh-')) {
            finalScriptSig = script_js_1.Script.encode([script_js_1.Script.encode([0, u.sha256(inputType.lastScript)])]);
        }
        else if (inputType.type.startsWith('sh-')) {
            finalScriptSig = script_js_1.Script.encode([...script_js_1.Script.decode(inputScript), inputType.lastScript]);
        }
        else if (inputType.type.startsWith('wsh-')) {
        }
        else if (inputType.txType !== 'segwit')
            finalScriptSig = inputScript;
        if (!finalScriptSig && !finalScriptWitness)
            throw new Error('Unknown error finalizing input');
        if (finalScriptSig)
            input.finalScriptSig = finalScriptSig;
        if (finalScriptWitness)
            input.finalScriptWitness = finalScriptWitness;
        cleanFinalInput(input);
    }
    finalize() {
        for (let i = 0; i < this.inputs.length; i++)
            this.finalizeIdx(i);
    }
    extract() {
        if (!this.isFinal)
            throw new Error('Transaction has unfinalized inputs');
        if (!this.outputs.length)
            throw new Error('Transaction has no outputs');
        if (this.fee < 0n)
            throw new Error('Outputs spends more than inputs amount');
        return this.toBytes(true, true);
    }
    combine(other) {
        for (const k of ['PSBTVersion', 'version', 'lockTime']) {
            if (this.opts[k] !== other.opts[k]) {
                throw new Error(`Transaction/combine: different ${k} this=${this.opts[k]} other=${other.opts[k]}`);
            }
        }
        for (const k of ['inputs', 'outputs']) {
            if (this[k].length !== other[k].length) {
                throw new Error(`Transaction/combine: different ${k} length this=${this[k].length} other=${other[k].length}`);
            }
        }
        const thisUnsigned = this.global.unsignedTx ? script_js_1.RawOldTx.encode(this.global.unsignedTx) : P.EMPTY;
        const otherUnsigned = other.global.unsignedTx
            ? script_js_1.RawOldTx.encode(other.global.unsignedTx)
            : P.EMPTY;
        if (!(0, utils_js_1.equalBytes)(thisUnsigned, otherUnsigned))
            throw new Error(`Transaction/combine: different unsigned tx`);
        this.global = psbt.mergeKeyMap(psbt.PSBTGlobal, this.global, other.global, undefined, this.opts.allowUnknown);
        for (let i = 0; i < this.inputs.length; i++)
            this.updateInput(i, other.inputs[i], true);
        for (let i = 0; i < this.outputs.length; i++)
            this.updateOutput(i, other.outputs[i], true);
        return this;
    }
    clone() {
        // deepClone probably faster, but this enforces that encoding is valid
        return Transaction.fromPSBT(this.toPSBT(this.opts.PSBTVersion), this.opts);
    }
}
exports.Transaction = Transaction;
function PSBTCombine(psbts) {
    if (!psbts || !Array.isArray(psbts) || !psbts.length)
        throw new Error('PSBTCombine: wrong PSBT list');
    const tx = Transaction.fromPSBT(psbts[0]);
    for (let i = 1; i < psbts.length; i++)
        tx.combine(Transaction.fromPSBT(psbts[i]));
    return tx.toPSBT();
}
// Copy-pasted from bip32 derive, maybe do something like 'bip32.parsePath'?
const HARDENED_OFFSET = 0x80000000;
function bip32Path(path) {
    const out = [];
    if (!/^[mM]'?/.test(path))
        throw new Error('Path must start with "m" or "M"');
    if (/^[mM]'?$/.test(path))
        return out;
    const parts = path.replace(/^[mM]'?\//, '').split('/');
    for (const c of parts) {
        const m = /^(\d+)('?)$/.exec(c);
        if (!m || m.length !== 3)
            throw new Error(`Invalid child index: ${c}`);
        let idx = +m[1];
        if (!Number.isSafeInteger(idx) || idx >= HARDENED_OFFSET)
            throw new Error('Invalid index');
        // hardened key
        if (m[2] === "'")
            idx += HARDENED_OFFSET;
        out.push(idx);
    }
    return out;
}
//# sourceMappingURL=transaction.js.map
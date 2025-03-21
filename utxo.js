"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._Estimator = exports._cmpBig = exports.toVsize = void 0;
exports.getPrevOut = getPrevOut;
exports.normalizeInput = normalizeInput;
exports.getInputType = getInputType;
exports.selectUTXO = selectUTXO;
const base_1 = require("@scure/base");
const P = require("micro-packed");
const payment_js_1 = require("./payment.js");
const psbt = require("./psbt.js");
const script_js_1 = require("./script.js");
const transaction_js_1 = require("./transaction.js"); // circular
const utils_js_1 = require("./utils.js");
// Normalizes input
function getPrevOut(input) {
    if (input.nonWitnessUtxo) {
        if (input.index === undefined)
            throw new Error('Unknown input index');
        return input.nonWitnessUtxo.outputs[input.index];
    }
    else if (input.witnessUtxo)
        return input.witnessUtxo;
    else
        throw new Error('Cannot find previous output info');
}
function normalizeInput(i, cur, allowedFields, disableScriptCheck = false, allowUnknown = false) {
    let { nonWitnessUtxo, txid } = i;
    // String support for common fields. We usually prefer Uint8Array to avoid errors
    // like hex looking string accidentally passed, however, in case of nonWitnessUtxo
    // it is better to expect string, since constructing this complex object will be
    // difficult for user
    if (typeof nonWitnessUtxo === 'string')
        nonWitnessUtxo = base_1.hex.decode(nonWitnessUtxo);
    if ((0, utils_js_1.isBytes)(nonWitnessUtxo))
        nonWitnessUtxo = script_js_1.RawTx.decode(nonWitnessUtxo);
    if (!('nonWitnessUtxo' in i) && nonWitnessUtxo === undefined)
        nonWitnessUtxo = cur?.nonWitnessUtxo;
    if (typeof txid === 'string')
        txid = base_1.hex.decode(txid);
    // TODO: if we have nonWitnessUtxo, we can extract txId from here
    if (txid === undefined)
        txid = cur?.txid;
    let res = { ...cur, ...i, nonWitnessUtxo, txid };
    if (!('nonWitnessUtxo' in i) && res.nonWitnessUtxo === undefined)
        delete res.nonWitnessUtxo;
    if (res.sequence === undefined)
        res.sequence = transaction_js_1.DEFAULT_SEQUENCE;
    if (res.tapMerkleRoot === null)
        delete res.tapMerkleRoot;
    res = psbt.mergeKeyMap(psbt.PSBTInput, res, cur, allowedFields, allowUnknown);
    psbt.PSBTInputCoder.encode(res); // Validates that everything is correct at this point
    let prevOut;
    if (res.nonWitnessUtxo && res.index !== undefined)
        prevOut = res.nonWitnessUtxo.outputs[res.index];
    else if (res.witnessUtxo)
        prevOut = res.witnessUtxo;
    if (prevOut && !disableScriptCheck)
        (0, payment_js_1.checkScript)(prevOut && prevOut.script, res.redeemScript, res.witnessScript);
    return res;
}
function getInputType(input, allowLegacyWitnessUtxo = false) {
    let txType = 'legacy';
    let defaultSighash = transaction_js_1.SignatureHash.ALL;
    const prevOut = getPrevOut(input);
    const first = payment_js_1.OutScript.decode(prevOut.script);
    let type = first.type;
    let cur = first;
    const stack = [first];
    if (first.type === 'tr') {
        defaultSighash = transaction_js_1.SignatureHash.DEFAULT;
        return {
            txType: 'taproot',
            type: 'tr',
            last: first,
            lastScript: prevOut.script,
            defaultSighash,
            sighash: input.sighashType || defaultSighash,
        };
    }
    else {
        if (first.type === 'wpkh' || first.type === 'wsh')
            txType = 'segwit';
        if (first.type === 'sh') {
            if (!input.redeemScript)
                throw new Error('inputType: sh without redeemScript');
            let child = payment_js_1.OutScript.decode(input.redeemScript);
            if (child.type === 'wpkh' || child.type === 'wsh')
                txType = 'segwit';
            stack.push(child);
            cur = child;
            type += `-${child.type}`;
        }
        // wsh can be inside sh
        if (cur.type === 'wsh') {
            if (!input.witnessScript)
                throw new Error('inputType: wsh without witnessScript');
            let child = payment_js_1.OutScript.decode(input.witnessScript);
            if (child.type === 'wsh')
                txType = 'segwit';
            stack.push(child);
            cur = child;
            type += `-${child.type}`;
        }
        const last = stack[stack.length - 1];
        if (last.type === 'sh' || last.type === 'wsh')
            throw new Error('inputType: sh/wsh cannot be terminal type');
        const lastScript = payment_js_1.OutScript.encode(last);
        const res = {
            type,
            txType,
            last,
            lastScript,
            defaultSighash,
            sighash: input.sighashType || defaultSighash,
        };
        if (txType === 'legacy' && !allowLegacyWitnessUtxo && !input.nonWitnessUtxo) {
            throw new Error(`Transaction/sign: legacy input without nonWitnessUtxo, can result in attack that forces paying higher fees. Pass allowLegacyWitnessUtxo=true, if you sure`);
        }
        return res;
    }
}
const toVsize = (weight) => Math.ceil(weight / 4);
exports.toVsize = toVsize;
const encodeTapBlock = (item) => psbt.TaprootControlBlock.encode(item);
function iterLeafs(tapLeafScript, sigSize, customScripts) {
    if (!tapLeafScript || !tapLeafScript.length)
        throw new Error('no leafs');
    const empty = () => new Uint8Array(sigSize);
    // If user want to select specific leaf, which can signed,
    // it is possible to remove all other leafs manually.
    // Sort leafs by control block length.
    const leafs = tapLeafScript.sort((a, b) => encodeTapBlock(a[0]).length - encodeTapBlock(b[0]).length);
    for (const [cb, _script] of leafs) {
        // Last byte is version
        const script = _script.slice(0, -1);
        const ver = _script[_script.length - 1];
        const outs = payment_js_1.OutScript.decode(script);
        let signatures = [];
        if (outs.type === 'tr_ms') {
            const m = outs.m;
            const n = outs.pubkeys.length - m;
            for (let i = 0; i < m; i++)
                signatures.push(empty());
            for (let i = 0; i < n; i++)
                signatures.push(P.EMPTY);
        }
        else if (outs.type === 'tr_ns') {
            for (const _pub of outs.pubkeys)
                signatures.push(empty());
        }
        else {
            if (!customScripts)
                throw new Error('Finalize: Unknown tapLeafScript');
            const leafHash = (0, payment_js_1.tapLeafHash)(script, ver);
            for (const c of customScripts) {
                if (!c.finalizeTaproot)
                    continue;
                const scriptDecoded = script_js_1.Script.decode(script);
                const csEncoded = c.encode(scriptDecoded);
                if (csEncoded === undefined)
                    continue;
                const pubKeys = scriptDecoded.filter((i) => {
                    if (!(0, utils_js_1.isBytes)(i))
                        return false;
                    try {
                        (0, utils_js_1.validatePubkey)(i, utils_js_1.PubT.schnorr);
                        return true;
                    }
                    catch (e) {
                        return false;
                    }
                });
                const finalized = c.finalizeTaproot(script, csEncoded, pubKeys.map((pubKey) => [{ pubKey, leafHash }, empty()]));
                if (!finalized)
                    continue;
                return finalized.concat(encodeTapBlock(cb));
            }
        }
        // Witness is stack, so last element will be used first
        return signatures.reverse().concat([script, encodeTapBlock(cb)]);
    }
    throw new Error('there was no witness');
}
function estimateInput(inputType, input, opts) {
    let script = P.EMPTY;
    let witness;
    // schnorr sig is always 64 bytes. except for cases when sighash is not default!
    if (inputType.txType === 'taproot') {
        const SCHNORR_SIG_SIZE = inputType.sighash !== transaction_js_1.SignatureHash.DEFAULT ? 65 : 64;
        if (input.tapInternalKey && !(0, utils_js_1.equalBytes)(input.tapInternalKey, utils_js_1.TAPROOT_UNSPENDABLE_KEY)) {
            witness = [new Uint8Array(SCHNORR_SIG_SIZE)];
        }
        else if (input.tapLeafScript) {
            witness = iterLeafs(input.tapLeafScript, SCHNORR_SIG_SIZE, opts.customScripts);
        }
        else
            throw new Error('estimateInput/taproot: unknown input');
    }
    else {
        // It is possible to grind signatures until it has minimal size (but changing fee value +N satoshi),
        // which will make estimations exact. But will be very hard for multi sig (need to make sure all signatures has small size).
        const empty = () => new Uint8Array(72); // max size of sigs
        const emptyPub = () => new Uint8Array(33); // size of pubkey
        let inputScript = P.EMPTY;
        let inputWitness = [];
        const ltype = inputType.last.type;
        if (ltype === 'ms') {
            const m = inputType.last.m;
            const sig = [0];
            for (let i = 0; i < m; i++)
                sig.push(empty());
            inputScript = script_js_1.Script.encode(sig);
        }
        else if (ltype === 'pk') {
            // 71 sig + 1 sighash
            inputScript = script_js_1.Script.encode([empty()]);
        }
        else if (ltype === 'pkh') {
            inputScript = script_js_1.Script.encode([empty(), emptyPub()]);
        }
        else if (ltype === 'wpkh') {
            inputScript = P.EMPTY;
            inputWitness = [empty(), emptyPub()];
        }
        else if (ltype === 'unknown' && !opts.allowUnknownInputs)
            throw new Error('Unknown inputs are not allowed');
        if (inputType.type.includes('wsh-')) {
            // P2WSH
            if (inputScript.length && inputType.lastScript.length) {
                inputWitness = script_js_1.Script.decode(inputScript).map((i) => {
                    if (i === 0)
                        return P.EMPTY;
                    if ((0, utils_js_1.isBytes)(i))
                        return i;
                    throw new Error(`Wrong witness op=${i}`);
                });
            }
            inputWitness = inputWitness.concat(inputType.lastScript);
        }
        if (inputType.txType === 'segwit')
            witness = inputWitness;
        if (inputType.type.startsWith('sh-wsh-')) {
            script = script_js_1.Script.encode([script_js_1.Script.encode([0, new Uint8Array(utils_js_1.sha256.outputLen)])]);
        }
        else if (inputType.type.startsWith('sh-')) {
            script = script_js_1.Script.encode([...script_js_1.Script.decode(inputScript), inputType.lastScript]);
        }
        else if (inputType.type.startsWith('wsh-')) {
        }
        else if (inputType.txType !== 'segwit')
            script = inputScript;
    }
    let weight = 160 + 4 * script_js_1.VarBytes.encode(script).length;
    let hasWitnesses = false;
    if (witness) {
        weight += script_js_1.RawWitness.encode(witness).length;
        hasWitnesses = true;
    }
    return { weight, hasWitnesses };
}
// Exported for tests, internal method
const _cmpBig = (a, b) => {
    const n = a - b;
    if (n < 0n)
        return -1;
    else if (n > 0n)
        return 1;
    return 0;
};
exports._cmpBig = _cmpBig;
function getScript(o, opts = {}, network = utils_js_1.NETWORK) {
    let script;
    if ('script' in o && (0, utils_js_1.isBytes)(o.script)) {
        script = o.script;
    }
    if ('address' in o) {
        if (typeof o.address !== 'string')
            throw new Error(`Estimator: wrong output address=${o.address}`);
        script = payment_js_1.OutScript.encode((0, payment_js_1.Address)(network).decode(o.address));
    }
    if (!script)
        throw new Error('Estimator: wrong output script');
    if (typeof o.amount !== 'bigint')
        throw new Error(`Estimator: wrong output amount=${o.amount}, should be of type bigint but got ${typeof o.amount}.`);
    if (script && !opts.allowUnknownOutputs && payment_js_1.OutScript.decode(script).type === 'unknown') {
        throw new Error('Estimator: unknown output script type, there is a chance that input is unspendable. Pass allowUnknownOutputs=true, if you sure');
    }
    if (!opts.disableScriptCheck)
        (0, payment_js_1.checkScript)(script);
    return script;
}
// class, because we need to re-use normalized inputs, instead of parsing each time
// internal stuff, exported for tests only
class _Estimator {
    constructor(inputs, outputs, opts) {
        this.requiredIndices = [];
        this.outputs = outputs;
        this.opts = opts;
        if (typeof opts.feePerByte !== 'bigint')
            throw new Error(`Estimator: wrong feePerByte=${opts.feePerByte}, should be of type bigint but got ${typeof opts.feePerByte}.`);
        // Dust stuff
        // TODO: think about this more:
        // - current dust filters tx which cannot be relayed by core
        // - but actual dust meaning is 'can be this amount spent?'
        // - dust contains full tx size. but we can use other inputs to pay for outputDust (and parially inputsDust)?
        // - not sure if we can spent anything with feePerByte: 3. It will be relayed, but will it be mined?
        // - for now it works exactly as bitcoin-core. But will create change/outputs which cannot be spent (reasonable).
        // Number of bytes needed to create and spend a UTXO.
        // https://github.com/bitcoin/bitcoin/blob/27a770b34b8f1dbb84760f442edb3e23a0c2420b/src/policy/policy.cpp#L28-L41
        const inputsDust = 32 + 4 + 1 + 107 + 4; // NOTE: can be smaller for segwit tx?
        const outputDust = 34; // NOTE: 'nSize = GetSerializeSize(txout)'
        const dustBytes = opts.dust === undefined ? BigInt(inputsDust + outputDust) : opts.dust;
        if (typeof dustBytes !== 'bigint') {
            throw new Error(`Estimator: wrong dust=${opts.dust}, should be of type bigint but got ${typeof opts.dust}.`);
        }
        // 3 sat/vb is the default minimum fee rate used to calculate dust thresholds by bitcoin core.
        // 3000 sat/kvb -> 3 sat/vb.
        // https://github.com/bitcoin/bitcoin/blob/27a770b34b8f1dbb84760f442edb3e23a0c2420b/src/policy/policy.h#L55
        const dustFee = opts.dustRelayFeeRate === undefined ? 3n : opts.dustRelayFeeRate;
        if (typeof dustFee !== 'bigint') {
            throw new Error(`Estimator: wrong dustRelayFeeRate=${opts.dustRelayFeeRate}, should be of type bigint but got ${typeof opts.dustRelayFeeRate}.`);
        }
        // Dust uses feePerbyte by default, but we allow separate dust fee if needed
        this.dust = dustBytes * dustFee;
        if (opts.requiredInputs !== undefined && !Array.isArray(opts.requiredInputs))
            throw new Error(`Estimator: wrong required inputs=${opts.requiredInputs}`);
        const network = opts.network || utils_js_1.NETWORK;
        let amount = 0n;
        // Base weight: tx with outputs, no inputs
        let baseWeight = 32;
        for (const o of outputs) {
            const script = getScript(o, opts, opts.network);
            baseWeight += 32 + 4 * script_js_1.VarBytes.encode(script).length;
            amount += o.amount;
        }
        if (typeof opts.changeAddress !== 'string')
            throw new Error(`Estimator: wrong change address=${opts.changeAddress}`);
        let changeWeight = baseWeight +
            32 +
            4 * script_js_1.VarBytes.encode(payment_js_1.OutScript.encode((0, payment_js_1.Address)(network).decode(opts.changeAddress))).length;
        baseWeight += 4 * script_js_1.CompactSizeLen.encode(outputs.length).length;
        // If there a lot of outputs change can change fee
        changeWeight += 4 * script_js_1.CompactSizeLen.encode(outputs.length + 1).length;
        this.baseWeight = baseWeight;
        this.changeWeight = changeWeight;
        this.amount = amount;
        const allInputs = Array.from(inputs);
        if (opts.requiredInputs) {
            for (let i = 0; i < opts.requiredInputs.length; i++)
                this.requiredIndices.push(allInputs.push(opts.requiredInputs[i]) - 1);
        }
        const inputKeys = new Set();
        this.normalizedInputs = allInputs.map((i) => {
            const normalized = normalizeInput(i, undefined, undefined, opts.disableScriptCheck, opts.allowUnknown);
            (0, transaction_js_1.inputBeforeSign)(normalized); // check fields
            const key = `${base_1.hex.encode(normalized.txid)}:${normalized.index}`;
            if (!opts.allowSameUtxo && inputKeys.has(key))
                throw new Error(`Estimator: same input passed multiple times: ${key}`);
            inputKeys.add(key);
            const inputType = getInputType(normalized, opts.allowLegacyWitnessUtxo);
            const prev = getPrevOut(normalized);
            const estimate = estimateInput(inputType, normalized, this.opts);
            const value = prev.amount - opts.feePerByte * BigInt((0, exports.toVsize)(estimate.weight)); // value = amount-fee
            return { inputType, normalized, amount: prev.amount, value, estimate };
        });
    }
    checkInputIdx(idx) {
        if (!Number.isSafeInteger(idx) || 0 > idx || idx >= this.normalizedInputs.length)
            throw new Error(`Wrong input index=${idx}`);
        return idx;
    }
    sortIndices(indices) {
        return indices.slice().sort((a, b) => {
            const ai = this.normalizedInputs[this.checkInputIdx(a)];
            const bi = this.normalizedInputs[this.checkInputIdx(b)];
            const out = (0, utils_js_1.compareBytes)(ai.normalized.txid, bi.normalized.txid);
            if (out !== 0)
                return out;
            return ai.normalized.index - bi.normalized.index;
        });
    }
    sortOutputs(outputs) {
        const scripts = outputs.map((o) => getScript(o, this.opts, this.opts.network));
        const indices = outputs.map((_, j) => j);
        return indices.sort((a, b) => {
            const aa = outputs[a].amount;
            const ba = outputs[b].amount;
            const out = (0, exports._cmpBig)(aa, ba);
            if (out !== 0)
                return out;
            return (0, utils_js_1.compareBytes)(scripts[a], scripts[b]);
        });
    }
    getSatoshi(weigth) {
        return this.opts.feePerByte * BigInt((0, exports.toVsize)(weigth));
    }
    // Sort by value instead of amount
    get biggest() {
        return this.normalizedInputs
            .map((_i, j) => j)
            .sort((a, b) => (0, exports._cmpBig)(this.normalizedInputs[b].value, this.normalizedInputs[a].value));
    }
    get smallest() {
        return this.biggest.reverse();
    }
    // These assume that UTXO array has historical order.
    // Otherwise, we have no way to know which tx is oldest
    // Explorers usually give UTXO in this order.
    get oldest() {
        return this.normalizedInputs.map((_i, j) => j);
    }
    get newest() {
        return this.oldest.reverse();
    }
    // exact - like blackjack from coinselect.
    // exact(biggest) will select one big utxo which is closer to targetValue+dust, if possible.
    // If not, it will accumulate largest utxo until value is close to targetValue+dust.
    accumulate(indices, exact = false, skipNegative = true, all = false) {
        // TODO: how to handle change addresses?
        // - cost of input
        // - cost of change output (if input requires change)
        // - cost of output spending
        // Dust threshold should be significantly bigger, no point in
        // creating an output, which cannot be spent.
        // coinselect doesn't consider cost of output address for dust.
        // Changing that can actually reduce privacy
        let weight = this.opts.alwaysChange ? this.changeWeight : this.baseWeight;
        let hasWitnesses = false;
        let num = 0;
        let inputsAmount = 0n;
        const targetAmount = this.amount;
        const res = new Set();
        let fee;
        for (const idx of this.requiredIndices) {
            this.checkInputIdx(idx);
            if (res.has(idx))
                throw new Error('required input encountered multiple times'); // should not happen
            const { estimate, amount } = this.normalizedInputs[idx];
            let newWeight = weight + estimate.weight;
            if (!hasWitnesses && estimate.hasWitnesses)
                newWeight += 2; // enable witness if needed
            const totalWeight = newWeight + 4 * script_js_1.CompactSizeLen.encode(num).length; // number of outputs can change weight
            fee = this.getSatoshi(totalWeight);
            weight = newWeight;
            if (estimate.hasWitnesses)
                hasWitnesses = true;
            num++;
            inputsAmount += amount;
            res.add(idx);
            // inputsAmount is enough to cover cost of tx
            if (!all && targetAmount + fee <= inputsAmount)
                return { indices: Array.from(res), fee, weight: totalWeight, total: inputsAmount };
        }
        for (const idx of indices) {
            this.checkInputIdx(idx);
            if (res.has(idx))
                continue; // skip required inputs
            const { estimate, amount, value } = this.normalizedInputs[idx];
            let newWeight = weight + estimate.weight;
            if (!hasWitnesses && estimate.hasWitnesses)
                newWeight += 2; // enable witness if needed
            const totalWeight = newWeight + 4 * script_js_1.CompactSizeLen.encode(num).length; // number of outputs can change weight
            fee = this.getSatoshi(totalWeight);
            // Best case scenario exact(biggest) -> we find biggest output, less than target+threshold
            if (exact && amount + inputsAmount > targetAmount + fee + this.dust)
                continue; // skip if added value is bigger than dust
            // Negative: cost of using input is more than value provided (negative)
            // By default 'blackjack' mode in coinselect doesn't use that, which means
            // it will use negative output if sorted by 'smallest'
            if (skipNegative && value <= 0n)
                continue;
            weight = newWeight;
            if (estimate.hasWitnesses)
                hasWitnesses = true;
            num++;
            inputsAmount += amount;
            res.add(idx);
            // inputsAmount is enough to cover cost of tx
            if (!all && targetAmount + fee <= inputsAmount)
                return { indices: Array.from(res), fee, weight: totalWeight, total: inputsAmount };
        }
        if (all) {
            const newWeight = weight + 4 * script_js_1.CompactSizeLen.encode(num).length;
            return { indices: Array.from(res), fee, weight: newWeight, total: inputsAmount };
        }
        return undefined;
    }
    // Works like coinselect default method
    default() {
        const { biggest } = this;
        const exact = this.accumulate(biggest, true, false);
        if (exact)
            return exact;
        return this.accumulate(biggest);
    }
    select(strategy) {
        if (strategy === 'all') {
            return this.accumulate(this.normalizedInputs.map((_, j) => j), false, true, true);
        }
        if (strategy === 'default')
            return this.default();
        const data = {
            Oldest: () => this.oldest,
            Newest: () => this.newest,
            Smallest: () => this.smallest,
            Biggest: () => this.biggest,
        };
        if (strategy.startsWith('exact')) {
            const [exactData, left] = strategy.slice(5).split('/');
            if (!data[exactData])
                throw new Error(`Estimator.select: wrong strategy=${strategy}`);
            strategy = left;
            const exact = this.accumulate(data[exactData](), true, true);
            if (exact)
                return exact;
        }
        if (strategy.startsWith('accum')) {
            const accumData = strategy.slice(5);
            if (!data[accumData])
                throw new Error(`Estimator.select: wrong strategy=${strategy}`);
            return this.accumulate(data[accumData]());
        }
        throw new Error(`Estimator.select: wrong strategy=${strategy}`);
    }
    result(strategy) {
        const s = this.select(strategy);
        if (!s)
            return;
        const { indices, weight, total } = s;
        let needChange = this.opts.alwaysChange;
        const changeWeight = this.opts.alwaysChange
            ? weight
            : weight + (this.changeWeight - this.baseWeight);
        const changeFee = this.getSatoshi(changeWeight);
        let fee = s.fee;
        const change = total - this.amount - changeFee;
        if (change > this.dust)
            needChange = true;
        let inputs = indices;
        let outputs = Array.from(this.outputs);
        if (needChange) {
            fee = changeFee;
            // this shouldn't happen!
            if (change < 0n)
                throw new Error(`Estimator.result: negative change=${change}`);
            outputs.push({ address: this.opts.changeAddress, amount: change });
        }
        if (this.opts.bip69) {
            inputs = this.sortIndices(inputs);
            outputs = this.sortOutputs(outputs).map((i) => outputs[i]);
        }
        const res = {
            inputs: inputs.map((i) => this.normalizedInputs[i].normalized),
            outputs,
            fee,
            weight: this.opts.alwaysChange ? s.weight : changeWeight,
            change: !!needChange,
        };
        let tx;
        if (this.opts.createTx) {
            const { inputs, outputs } = res;
            tx = new transaction_js_1.Transaction(this.opts);
            for (const i of inputs)
                tx.addInput(i);
            for (const o of outputs)
                tx.addOutput({ ...o, script: getScript(o, this.opts, this.opts.network) });
        }
        return Object.assign(res, { tx });
        // return { ...res, tx: tx };
    }
}
exports._Estimator = _Estimator;
function selectUTXO(inputs, outputs, strategy, opts) {
    // Defaults: do we want bip69 by default?
    const _opts = { createTx: true, bip69: true, ...opts };
    const est = new _Estimator(inputs, outputs, _opts);
    return est.result(strategy);
}
//# sourceMappingURL=utxo.js.map
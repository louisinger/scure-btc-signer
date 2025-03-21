"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TEST_NETWORK = exports.NETWORK = exports.TAPROOT_UNSPENDABLE_KEY = exports.PubT = exports.tagSchnorr = exports.signSchnorr = exports.pubECDSA = exports.pubSchnorr = exports.randomPrivateKeyBytes = exports.sha256x2 = exports.hash160 = exports.sha256 = exports.isBytes = exports.equalBytes = exports.concatBytes = void 0;
exports.signECDSA = signECDSA;
exports.validatePubkey = validatePubkey;
exports.tapTweak = tapTweak;
exports.taprootTweakPrivKey = taprootTweakPrivKey;
exports.taprootTweakPubkey = taprootTweakPubkey;
exports.compareBytes = compareBytes;
const secp256k1_1 = require("@noble/curves/secp256k1");
const ripemd160_1 = require("@noble/hashes/ripemd160");
const sha256_1 = require("@noble/hashes/sha256");
Object.defineProperty(exports, "sha256", { enumerable: true, get: function () { return sha256_1.sha256; } });
const micro_packed_1 = require("micro-packed");
const Point = secp256k1_1.secp256k1.ProjectivePoint;
const CURVE_ORDER = secp256k1_1.secp256k1.CURVE.n;
const isBytes = micro_packed_1.utils.isBytes;
exports.isBytes = isBytes;
const concatBytes = micro_packed_1.utils.concatBytes;
exports.concatBytes = concatBytes;
const equalBytes = micro_packed_1.utils.equalBytes;
exports.equalBytes = equalBytes;
const hash160 = (msg) => (0, ripemd160_1.ripemd160)((0, sha256_1.sha256)(msg));
exports.hash160 = hash160;
const sha256x2 = (...msgs) => (0, sha256_1.sha256)((0, sha256_1.sha256)(concatBytes(...msgs)));
exports.sha256x2 = sha256x2;
exports.randomPrivateKeyBytes = secp256k1_1.schnorr.utils.randomPrivateKey;
exports.pubSchnorr = secp256k1_1.schnorr.getPublicKey;
exports.pubECDSA = secp256k1_1.secp256k1.getPublicKey;
// low-r signature grinding. Used to reduce tx size by 1 byte.
// noble/secp256k1 does not support the feature: it is not used outside of BTC.
// We implement it manually, because in BTC it's common.
// Not best way, but closest to bitcoin implementation (easier to check)
const hasLowR = (sig) => sig.r < CURVE_ORDER / 2n;
function signECDSA(hash, privateKey, lowR = false) {
    let sig = secp256k1_1.secp256k1.sign(hash, privateKey);
    if (lowR && !hasLowR(sig)) {
        const extraEntropy = new Uint8Array(32);
        let counter = 0;
        while (!hasLowR(sig)) {
            extraEntropy.set(micro_packed_1.U32LE.encode(counter++));
            sig = secp256k1_1.secp256k1.sign(hash, privateKey, { extraEntropy });
            if (counter > 4294967295)
                throw new Error('lowR counter overflow: report the error');
        }
    }
    return sig.toDERRawBytes();
}
exports.signSchnorr = secp256k1_1.schnorr.sign;
exports.tagSchnorr = secp256k1_1.schnorr.utils.taggedHash;
var PubT;
(function (PubT) {
    PubT[PubT["ecdsa"] = 0] = "ecdsa";
    PubT[PubT["schnorr"] = 1] = "schnorr";
})(PubT || (exports.PubT = PubT = {}));
function validatePubkey(pub, type) {
    const len = pub.length;
    if (type === PubT.ecdsa) {
        if (len === 32)
            throw new Error('Expected non-Schnorr key');
        Point.fromHex(pub); // does assertValidity
        return pub;
    }
    else if (type === PubT.schnorr) {
        if (len !== 32)
            throw new Error('Expected 32-byte Schnorr key');
        secp256k1_1.schnorr.utils.lift_x(secp256k1_1.schnorr.utils.bytesToNumberBE(pub));
        return pub;
    }
    else {
        throw new Error('Unknown key type');
    }
}
function tapTweak(a, b) {
    const u = secp256k1_1.schnorr.utils;
    const t = u.taggedHash('TapTweak', a, b);
    const tn = u.bytesToNumberBE(t);
    if (tn >= CURVE_ORDER)
        throw new Error('tweak higher than curve order');
    return tn;
}
function taprootTweakPrivKey(privKey, merkleRoot = new Uint8Array()) {
    const u = secp256k1_1.schnorr.utils;
    const seckey0 = u.bytesToNumberBE(privKey); // seckey0 = int_from_bytes(seckey0)
    const P = Point.fromPrivateKey(seckey0); // P = point_mul(G, seckey0)
    // seckey = seckey0 if has_even_y(P) else SECP256K1_ORDER - seckey0
    const seckey = P.hasEvenY() ? seckey0 : u.mod(-seckey0, CURVE_ORDER);
    const xP = u.pointToBytes(P);
    // t = int_from_bytes(tagged_hash("TapTweak", bytes_from_int(x(P)) + h)); >= SECP256K1_ORDER check
    const t = tapTweak(xP, merkleRoot);
    // bytes_from_int((seckey + t) % SECP256K1_ORDER)
    return u.numberToBytesBE(u.mod(seckey + t, CURVE_ORDER), 32);
}
function taprootTweakPubkey(pubKey, h) {
    const u = secp256k1_1.schnorr.utils;
    const t = tapTweak(pubKey, h); // t = int_from_bytes(tagged_hash("TapTweak", pubkey + h))
    const P = u.lift_x(u.bytesToNumberBE(pubKey)); // P = lift_x(int_from_bytes(pubkey))
    const Q = P.add(Point.fromPrivateKey(t)); // Q = point_add(P, point_mul(G, t))
    const parity = Q.hasEvenY() ? 0 : 1; // 0 if has_even_y(Q) else 1
    return [u.pointToBytes(Q), parity]; // bytes_from_int(x(Q))
}
// Another stupid decision, where lack of standard affects security.
// Multisig needs to be generated with some key.
// We are using approach from BIP 341/bitcoinjs-lib: SHA256(uncompressedDER(SECP256K1_GENERATOR_POINT))
// It is possible to switch SECP256K1_GENERATOR_POINT with some random point;
// but it's too complex to prove.
// Also used by bitcoin-core and bitcoinjs-lib
exports.TAPROOT_UNSPENDABLE_KEY = (0, sha256_1.sha256)(Point.BASE.toRawBytes(false));
exports.NETWORK = {
    bech32: 'bc',
    pubKeyHash: 0x00,
    scriptHash: 0x05,
    wif: 0x80,
};
exports.TEST_NETWORK = {
    bech32: 'tb',
    pubKeyHash: 0x6f,
    scriptHash: 0xc4,
    wif: 0xef,
};
// Exported for tests, internal method
function compareBytes(a, b) {
    if (!isBytes(a) || !isBytes(b))
        throw new Error(`cmp: wrong type a=${typeof a} b=${typeof b}`);
    // -1 -> a<b, 0 -> a==b, 1 -> a>b
    const len = Math.min(a.length, b.length);
    for (let i = 0; i < len; i++)
        if (a[i] != b[i])
            return Math.sign(a[i] - b[i]);
    return Math.sign(a.length - b.length);
}
//# sourceMappingURL=utils.js.map
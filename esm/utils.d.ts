import { schnorr } from '@noble/curves/secp256k1';
import { sha256 } from '@noble/hashes/sha256';
export type Hex = string | Uint8Array;
export type Bytes = Uint8Array;
declare const isBytes: (a: unknown) => a is Uint8Array;
declare const concatBytes: (...arrays: Uint8Array[]) => Uint8Array;
declare const equalBytes: (a: Uint8Array, b: Uint8Array) => boolean;
export { concatBytes, equalBytes, isBytes, sha256 };
export declare const hash160: (msg: Uint8Array) => Uint8Array;
export declare const sha256x2: (...msgs: Uint8Array[]) => Uint8Array;
export declare const randomPrivateKeyBytes: () => Uint8Array;
export declare const pubSchnorr: (priv: string | Uint8Array) => Uint8Array;
export declare const pubECDSA: (privateKey: string | Uint8Array, isCompressed?: boolean) => Uint8Array;
export declare function signECDSA(hash: Bytes, privateKey: Bytes, lowR?: boolean): Bytes;
export declare const signSchnorr: typeof schnorr.sign;
export declare const tagSchnorr: typeof schnorr.utils.taggedHash;
export declare enum PubT {
    ecdsa = 0,
    schnorr = 1
}
export declare function validatePubkey(pub: Bytes, type: PubT): Bytes;
export declare function tapTweak(a: Bytes, b: Bytes): bigint;
export declare function taprootTweakPrivKey(privKey: Bytes, merkleRoot?: Bytes): Bytes;
export declare function taprootTweakPubkey(pubKey: Bytes, h: Bytes): [Bytes, number];
export declare const TAPROOT_UNSPENDABLE_KEY: Bytes;
export type BTC_NETWORK = {
    bech32: string;
    pubKeyHash: number;
    scriptHash: number;
    wif: number;
};
export declare const NETWORK: BTC_NETWORK;
export declare const TEST_NETWORK: BTC_NETWORK;
export declare function compareBytes(a: Bytes, b: Bytes): number;
//# sourceMappingURL=utils.d.ts.map
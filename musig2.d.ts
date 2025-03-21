/**
 * Represents a pair of public and secret nonces used in MuSig2 signing.
 */
export type Nonces = {
    public: Uint8Array;
    secret: Uint8Array;
};
/**
 * Represents a deterministic nonce, including its public part and the resulting partial signature.
 */
export type DetNonce = {
    publicNonce: Uint8Array;
    partialSig: Uint8Array;
};
/**
 * Represents an error indicating an invalid contribution from a signer.
 * This allows pointing out which participant is malicious and what specifically is wrong.
 */
export declare class InvalidContributionErr extends Error {
    readonly idx: number;
    constructor(idx: number, m: string);
}
export declare function IndividualPubkey(seckey: Uint8Array): Uint8Array;
/**
 * Lexicographically sorts an array of public keys.
 * @param publicKeys An array of public keys (Uint8Array).
 * @returns A new array containing the sorted public keys.
 * @throws {Error} If the input is not an array or if any element is not a Uint8Array of the correct length.
 */
export declare function sortKeys(publicKeys: Uint8Array[]): Uint8Array[];
/**
 * Aggregates multiple public keys using the MuSig2 key aggregation algorithm.
 * @param publicKeys An array of individual public keys (Uint8Array).
 * @param tweaks An optional array of tweaks (Uint8Array) to apply to the aggregate public key.
 * @param isXonly An optional array of booleans indicating whether each tweak is an X-only tweak.
 * @returns An object containing the aggregate public key, accumulated sign, and accumulated tweak.
 * @throws {Error} If the input is invalid, such as non array publicKeys, tweaks and isXonly array length not matching.
 * @throws {InvalidContributionErr} If any of the public keys are invalid and cannot be processed.
 */
export declare function keyAggregate(publicKeys: Uint8Array[], tweaks?: Uint8Array[], isXonly?: boolean[]): {
    aggPublicKey: import("@noble/curves/abstract/weierstrass.js").ProjPointType<bigint>;
    gAcc: bigint;
    tweakAcc: bigint;
};
/**
 * Exports the aggregate public key to a byte array.
 * @param ctx The result of the keyAggregate function.
 * @returns The aggregate public key as a byte array.
 */
export declare function keyAggExport(ctx: ReturnType<typeof keyAggregate>): Uint8Array;
/**
 * Generates a nonce pair (public and secret) for MuSig2 signing.
 * @param publicKey The individual public key of the signer (Uint8Array).
 * @param secretKey The secret key of the signer (Uint8Array). Optional, included to xor randomness
 * @param aggPublicKey The aggregate public key of all signers (Uint8Array).
 * @param msg The message to be signed (Uint8Array).
 * @param extraIn Extra input for nonce generation (Uint8Array).
 * @param rand Random 32-bytes for generating the nonces (Uint8Array).
 * @returns An object containing the public and secret nonces.
 * @throws {Error} If the input is invalid, such as non array publicKey, secretKey, aggPublicKey.
 */
export declare function nonceGen(publicKey: Uint8Array, secretKey?: Uint8Array, aggPublicKey?: Uint8Array, msg?: Uint8Array, extraIn?: Uint8Array, rand?: Uint8Array): Nonces;
/**
 * Aggregates public nonces from multiple signers into a single aggregate nonce.
 * @param pubNonces An array of public nonces from each signer (Uint8Array). Each pubnonce is assumed to be 66 bytes (two 33‐byte parts).
 * @returns The aggregate nonce (Uint8Array).
 * @throws {Error} If the input is not an array or if any element is not a Uint8Array of the correct length.
 * @throws {InvalidContributionErr} If any of the public nonces are invalid and cannot be processed.
 */
export declare function nonceAggregate(pubNonces: Uint8Array[]): Uint8Array;
export declare class Session {
    private publicKeys;
    private Q;
    private gAcc;
    private tweakAcc;
    private b;
    private R;
    private e;
    private tweaks;
    private isXonly;
    private L;
    private secondKey;
    /**
     * Constructor for the Session class.
     * It precomputes and stores values derived from the aggregate nonce, public keys,
     * message, and optional tweaks, optimizing the signing process.
     * @param aggNonce The aggregate nonce (Uint8Array) from all participants combined, must be 66 bytes.
     * @param publicKeys An array of public keys (Uint8Array) from each participant, must be 33 bytes.
     * @param msg The message (Uint8Array) to be signed.
     * @param tweaks Optional array of tweaks (Uint8Array) to be applied to the aggregate public key, each must be 32 bytes. Defaults to [].
     * @param isXonly Optional array of booleans indicating whether each tweak is an X-only tweak. Defaults to [].
     * @throws {Error} If the input is invalid, such as wrong array sizes or lengths.
     */
    constructor(aggNonce: Uint8Array, publicKeys: Uint8Array[], msg: Uint8Array, tweaks?: Uint8Array[], isXonly?: boolean[]);
    /**
     * Calculates the key aggregation coefficient for a given point.
     * @private
     * @param P The point to calculate the coefficient for.
     * @returns The key aggregation coefficient as a bigint.
     * @throws {Error} If the provided public key is not included in the list of pubkeys.
     */
    private getSessionKeyAggCoeff;
    private partialSigVerifyInternal;
    /**
     * Generates a partial signature for a given message, secret nonce, secret key, and session context.
     * @param secretNonce The secret nonce for this signing session (Uint8Array). MUST be securely erased after use.
     * @param secret The secret key of the signer (Uint8Array).
     * @param sessionCtx The session context containing all necessary information for signing.
     * @param fastSign if set to true, the signature is created without checking validity.
     * @returns The partial signature (Uint8Array).
     * @throws {Error} If the input is invalid, such as wrong array sizes, invalid nonce or secret key.
     */
    sign(secretNonce: Uint8Array, secret: Uint8Array, fastSign?: boolean): Uint8Array;
    /**
     * Verifies a partial signature against the aggregate public key and other session parameters.
     * @param partialSig The partial signature to verify (Uint8Array).
     * @param pubNonces An array of public nonces from each signer (Uint8Array).
     * @param pubKeys An array of public keys from each signer (Uint8Array).
     * @param tweaks An array of tweaks applied to the aggregate public key.
     * @param isXonly An array of booleans indicating whether each tweak is an X-only tweak.
     * @param msg The message that was signed (Uint8Array).
     * @param i The index of the signer whose partial signature is being verified.
     * @returns True if the partial signature is valid, false otherwise.
     * @throws {Error} If the input is invalid, such as non array partialSig, pubNonces, pubKeys, tweaks.
     */
    partialSigVerify(partialSig: Uint8Array, pubNonces: Uint8Array[], i: number): boolean;
    /**
     * Aggregates partial signatures from multiple signers into a single final signature.
     * @param partialSigs An array of partial signatures from each signer (Uint8Array).
     * @param sessionCtx The session context containing all necessary information for signing.
     * @returns The final aggregate signature (Uint8Array).
     * @throws {Error} If the input is invalid, such as wrong array sizes, invalid signature.
     */
    partialSigAgg(partialSigs: Uint8Array[]): Uint8Array;
}
/**
 * Generates a nonce pair and partial signature deterministically for a single signer.
 * @param secret The secret key of the signer (Uint8Array).
 * @param aggOtherNonce The aggregate public nonce of all other signers (Uint8Array).
 * @param publicKeys An array of all signers' public keys (Uint8Array).
 * @param tweaks An array of tweaks to apply to the aggregate public key.
 * @param isXonly An array of booleans indicating whether each tweak is an X-only tweak.
 * @param msg The message to be signed (Uint8Array).
 * @param rand Optional extra randomness (Uint8Array).
 * @returns An object containing the public nonce and partial signature.
 */
export declare function deterministicSign(secret: Uint8Array, aggOtherNonce: Uint8Array, publicKeys: Uint8Array[], msg: Uint8Array, tweaks?: Uint8Array[], isXonly?: boolean[], rand?: Uint8Array, fastSign?: boolean): DetNonce;
//# sourceMappingURL=musig2.d.ts.map
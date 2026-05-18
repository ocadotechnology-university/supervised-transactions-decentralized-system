const encoder = new TextEncoder();

// Uses SubtleCrypto interface from Web Crypto API, native to browsers
// Not all browsers are compatible, see: https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto#browser_compatibility
export function generateEd25519KeyPair(): Promise<CryptoKeyPair> {
    return crypto.subtle.generateKey(
        {
            name: "Ed25519",
        },
        true,
        ["sign", "verify"],
    ) as Promise<CryptoKeyPair>;
}

export function exportKey(key: CryptoKey): Promise<JsonWebKey> {
    return crypto.subtle.exportKey("jwk", key) as Promise<JsonWebKey>;
}

export function importKey(jwk: JsonWebKey, usage: "sign" | "verify"): Promise<CryptoKey> {
    return crypto.subtle.importKey(
        "jwk",
        jwk,
        {
            name: "Ed25519",
        },
        false,
        [usage],
    );
}

export function signData(privateKey: CryptoKey, encodedData: BufferSource): Promise<ArrayBuffer> {
    return crypto.subtle.sign(
        {
            name: "Ed25519",
        },
        privateKey,
        encodedData,
    );
}

export function encodeData(data: string): BufferSource {
    return encoder.encode(data);
}

// Uses fromBase64() and toBase64() methods from Uint8Array built-in object
// See browser compatibility: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array#browser_compatibility
export function bufferToBase64(data: ArrayBuffer): string {
    return new Uint8Array(data).toBase64();
}

export function generateId(length: number = 6): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const randomValues = new Uint8Array(length);
    crypto.getRandomValues(randomValues);

    let result = '';
    for (let i = 0; i < length; i++) {
        result += charset[randomValues[i] % charset.length];
    }
    return result;
}
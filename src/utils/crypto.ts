
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

// Uses SubtleCrypto interface from Web Crypto API, native to browsers
// Not all browsers are compatible, see: https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto#browser_compatibility
export async function generateEd25519KeyPair() {
    try {
        const { publicKey, privateKey } = await crypto.subtle.generateKey(
            {
                name: "Ed25519",
            },
            true,
            ["sign", "verify"],
        );
        return { publicKey, privateKey };
    } catch (error) {
        console.error("generateEd25519KeyPair failed:", error);
        throw error;
    }
}

export async function exportKey(key: CryptoKey) {
    try {
        return await crypto.subtle.exportKey("jwk", key);
    } catch (error) {
        console.error("exportKey failed:", error);
        throw error;
    }
}

export function generateUUID() {
    try {
        return crypto.randomUUID();
    } catch (error) {
        console.error("generateUUID failed:", error);
        throw error;
    }
}
const encoder = new TextEncoder();
const decoder = new TextDecoder();

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

export async function importPrivateKey(jwk: JsonWebKey) {
    try {
        return await crypto.subtle.importKey(
            "jwk",
            jwk,
            {
                name: "Ed25519",
            },
            true,
            ["sign"],
        );
    } catch (error) {
        console.error("importPrivateKey failed:", error);
        throw error;
    }
}

export async function importPublicKey(jwk: JsonWebKey) {
    try {
        return await crypto.subtle.importKey(
            "jwk",
            jwk,
            {
                name: "Ed25519",
            },
            true,
            ["verify"],
        );
    } catch (error) {
        console.error("importPublicKey failed:", error);
        throw error;
    }
}

export async function signData(privateKey: CryptoKey, encodedData: BufferSource) {
    try {
        return await crypto.subtle.sign(
            {
                name: "Ed25519",
            },
            privateKey,
            encodedData,
        );
    } catch (error) {
        console.error("signData failed:", error);
        throw error;
    }
}

export async function verifyData(publicKey: CryptoKey, signature: ArrayBuffer, encodedData: BufferSource) {
    try {
        return await crypto.subtle.verify(
            {
                name: "Ed25519",
            },
            publicKey,
            signature,
            encodedData,
        );
    } catch (error) {
        console.error("verifyData failed:", error);
        throw error;
    }
}

export function encodeData(data: string) {
    try {
        return encoder.encode(data);
    } catch (error) {
        console.error("encodeData failed:", error);
        throw error;
    }
}

export function decodeData(data: BufferSource) {
    try {
        return decoder.decode(data);
    } catch (error) {
        console.error("decodeData failed:", error);
        throw error;
    }
}

export async function digestData(data: BufferSource) {
    try {
        return await crypto.subtle.digest("SHA-256", data);
    } catch (error) {
        console.error("digestData failed:", error);
        throw error;
    }
}

// Uses fromBase64() and toBase64() methods from Uint8Array built-in object
// See browser compatibility: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array#browser_compatibility
export function bufferToBase64(data: ArrayBuffer) {
    try {
        return new Uint8Array(data).toBase64();
    } catch (error) {
        console.error("bufferToBase64 failed:", error);
        throw error;
    }
}

export function base64ToBuffer(data: string) {
    try {
        return Uint8Array.fromBase64(data).buffer;
    } catch (error) {
        console.error("base64ToBuffer failed:", error);
        throw error;
    }
}

export function generateID(length: number = 6): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return result;
}


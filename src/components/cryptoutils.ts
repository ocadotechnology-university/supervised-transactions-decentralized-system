const encoder = new TextEncoder();
const decoder = new TextDecoder();

// Uses SubtleCrypto interface from Web Crypto API, native to browsers
// Not all browsers are compatible, see: https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto#browser_compatibility
// Generate new keypair
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

// Export CryptoKey object to portable format (JSON Web Key)
export async function exportKey(key: CryptoKey) {
    try {
        return await crypto.subtle.exportKey("jwk", key);
    } catch (error) {
        console.error("exportKey failed:", error);
        throw error;
    }
}

// Import JSON Web Key to CryptoKey object (private)
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

// Import JSON Web Key to CryptoKey object (public)
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

// Generate digital signature
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

// Verify digital signature
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

// Uses TextEncoder/TextDecoder interface from Encoding API, compatible with old browser versions
// Encode data to buffer
export function encodeData(data: string) {
    try {
        return encoder.encode(data);
    } catch (error) {
        console.error("encodeData failed:", error);
        throw error;
    }
}

// Decode data from buffer (might be unnecessary)
export function decodeData(data: BufferSource) {
    try {
        return decoder.decode(data);
    } catch (error) {
        console.error("decodeData failed:", error);
        throw error;
    }
}

//Generate SHA256 digest
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
// Encode signature buffer to Base64 string
export function bufferToBase64(data: ArrayBuffer) {
    try {
        return new Uint8Array(data).toBase64();
    } catch (error) {
        console.error("bufferToBase64 failed:", error);
        throw error;
    }
}

// Encode Base64 string to buffer
export function base64ToBuffer(data: string) {
    try {
        return Uint8Array.fromBase64(data).buffer;
    } catch (error) {
        console.error("base64ToBuffer failed:", error);
        throw error;
    }
}

// Generate UUIDv4 using Crypto interface from Web Crypto API
export function generateUUID() {
    try {
        return crypto.randomUUID();
    } catch (error) {
        console.error("generateUUID failed:", error);
        throw error;
    }
}

// Hash a string using SHA256 - this is used for password checking only
export async function passHash(data: string) {
    try {
        const encoded = encodeData(data);
        const hashBuffer = await digestData(encoded);
        return bufferToBase64(hashBuffer);
    } catch (error) {
        console.error("Failed to hash text:", error);
        return null;
    }
}
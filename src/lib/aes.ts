import crypto from "crypto";

// Pastikan environment variables ada
if (!process.env.CIPHER_SECRET_KEY || !process.env.CIPHER_IV) {
    throw new Error("CIPHER_SECRET_KEY and CIPHER_IV must be defined");
}

const SECRET_KEY = Buffer.from(process.env.CIPHER_SECRET_KEY, 'utf8').slice(0, 32);
const IV = Buffer.from(process.env.CIPHER_IV, 'utf8').slice(0, 16);

export function encryptAES(data: string): string {
    const cipher = crypto.createCipheriv("aes-256-cbc", SECRET_KEY, IV);

    return cipher.update(data, 'utf8', 'base64') + cipher.final('base64');
}

export  function decryptAES(encryptedData: string) {
    const decipher = crypto.createDecipheriv("aes-256-cbc", SECRET_KEY, IV);

    return decipher.update(encryptedData, 'base64', 'utf8') + decipher.final('utf8');
}
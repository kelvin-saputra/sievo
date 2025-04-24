import crypto from "crypto";

export function encryptAESClient(data: string): string {
    if (!process.env.NEXT_PUBLIC_CIPHER_SECRET_KEY || !process.env.NEXT_PUBLIC_CIPHER_IV) {
        throw new Error("CIPHER_SECRET_KEY and CIPHER_IV on Client must be defined")
    }

    const SECRET_KEY = Buffer.from(process.env.NEXT_PUBLIC_CIPHER_SECRET_KEY, 'utf8').slice(0, 32);
    const IV = Buffer.from(process.env.NEXT_PUBLIC_CIPHER_IV, 'utf8').slice(0, 16);

    const cipher = crypto.createCipheriv("aes-256-cbc", SECRET_KEY, IV);

    return cipher.update(data, 'utf8', 'base64') + cipher.final('base64');
}

export function encryptAES(data: string): string {
    if (!process.env.CIPHER_SECRET_KEY || !process.env.CIPHER_IV) {
        throw new Error("CIPHER_SECRET_KEY and CIPHER_IV must be defined");
    }
    
    const SECRET_KEY = Buffer.from(process.env.CIPHER_SECRET_KEY, 'utf8').slice(0, 32);
    const IV = Buffer.from(process.env.CIPHER_IV, 'utf8').slice(0, 16);
    const cipher = crypto.createCipheriv("aes-256-cbc", SECRET_KEY, IV);
    
    return cipher.update(data, 'utf8', 'base64') + cipher.final('base64');
}

export  function decryptAES(encryptedData: string) {
    if (!process.env.CIPHER_SECRET_KEY || !process.env.CIPHER_IV) {
        throw new Error("CIPHER_SECRET_KEY and CIPHER_IV must be defined");
    }
    
    const SECRET_KEY = Buffer.from(process.env.CIPHER_SECRET_KEY, 'utf8').slice(0, 32);
    const IV = Buffer.from(process.env.CIPHER_IV, 'utf8').slice(0, 16);
    const decipher = crypto.createDecipheriv("aes-256-cbc", SECRET_KEY, IV);

    return decipher.update(encryptedData, 'base64', 'utf8') + decipher.final('utf8');
}

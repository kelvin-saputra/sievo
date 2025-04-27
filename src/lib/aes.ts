async function getKeyAndIv(): Promise<{ key: CryptoKey; iv: Uint8Array }> {
    const encoder = new TextEncoder()
    const keyBytes = encoder.encode(process.env.NEXT_PUBLIC_CIPHER_SECRET_KEY!)
    const ivBytes  = encoder.encode(process.env.NEXT_PUBLIC_CIPHER_IV!)
    const key = await crypto.subtle.importKey(
      'raw',
      keyBytes,
      { name: 'AES-CBC' },
      false,
      ['encrypt', 'decrypt']
    )
    return { key, iv: ivBytes.slice(0, 16) }
  }
  
  export async function encryptAES(data: string): Promise<string> {
    const { key, iv } = await getKeyAndIv()
    const encoder = new TextEncoder()
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-CBC', iv },
      key,
      encoder.encode(data)
    )
    // ArrayBuffer → Base64
    const u8 = new Uint8Array(encrypted)
    let str = ''
    u8.forEach(b => (str += String.fromCharCode(b)))
    return btoa(str)
  }
  
  export async function decryptAES(encryptedB64: string): Promise<string> {
    const { key, iv } = await getKeyAndIv()
    const binary = atob(encryptedB64)
    const data = new Uint8Array(binary.split('').map(c => c.charCodeAt(0)))
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-CBC', iv },
      key,
      data
    )
    return new TextDecoder().decode(decrypted)
  }
  
const encoder = new TextEncoder()
const decoder = new TextDecoder()

export type EncryptedPayload = {
  ciphertext: string
  iv: string
  salt: string
  version: 1
}

export async function deriveKey(passphrase: string, salt: ArrayBuffer) {
  const baseKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey'],
  )

  return crypto.subtle.deriveKey(
    {
      hash: 'SHA-256',
      iterations: 210_000,
      name: 'PBKDF2',
      salt,
    },
    baseKey,
    { length: 256, name: 'AES-GCM' },
    false,
    ['decrypt', 'encrypt'],
  )
}

export async function encryptText(plainText: string, passphrase: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const key = await deriveKey(passphrase, toArrayBuffer(salt))
  const encrypted = await crypto.subtle.encrypt(
    { iv: toArrayBuffer(iv), name: 'AES-GCM' },
    key,
    encoder.encode(plainText),
  )

  return JSON.stringify({
    ciphertext: toBase64(new Uint8Array(encrypted)),
    iv: toBase64(iv),
    salt: toBase64(salt),
    version: 1,
  } satisfies EncryptedPayload)
}

export async function decryptText(payloadText: string, passphrase: string) {
  const payload = JSON.parse(payloadText) as EncryptedPayload
  const salt = fromBase64(payload.salt)
  const iv = fromBase64(payload.iv)
  const ciphertext = fromBase64(payload.ciphertext)
  const key = await deriveKey(passphrase, toArrayBuffer(salt))
  const decrypted = await crypto.subtle.decrypt(
    { iv: toArrayBuffer(iv), name: 'AES-GCM' },
    key,
    toArrayBuffer(ciphertext),
  )

  return decoder.decode(decrypted)
}

function toBase64(bytes: Uint8Array) {
  return btoa(String.fromCharCode(...bytes))
}

function fromBase64(value: string) {
  return Uint8Array.from(atob(value), (character) => character.charCodeAt(0))
}

function toArrayBuffer(bytes: Uint8Array) {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer
}

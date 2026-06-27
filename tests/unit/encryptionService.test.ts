import { describe, expect, it } from 'vitest'

import {
  decryptText,
  encryptText,
  type EncryptedPayload,
} from '../../src/features/journal/services/encryptionService'

describe('journal encryption service', () => {
  it('encrypts journal text into a versioned payload that does not expose plaintext', async () => {
    const encrypted = await encryptText('A private journal reflection.', 'strong-passphrase')
    const payload = JSON.parse(encrypted) as EncryptedPayload

    expect(payload.version).toBe(1)
    expect(payload.ciphertext).toEqual(expect.any(String))
    expect(payload.iv).toEqual(expect.any(String))
    expect(payload.salt).toEqual(expect.any(String))
    expect(encrypted).not.toContain('private journal')
  })

  it('decrypts encrypted text with the matching passphrase', async () => {
    const encrypted = await encryptText('Today I made progress on LifeOS.', 'correct-passphrase')

    await expect(decryptText(encrypted, 'correct-passphrase')).resolves.toBe(
      'Today I made progress on LifeOS.',
    )
  })

  it('rejects decryption when the passphrase is wrong', async () => {
    const encrypted = await encryptText('Keep this entry sealed.', 'correct-passphrase')

    await expect(decryptText(encrypted, 'wrong-passphrase')).rejects.toThrow()
  })
})

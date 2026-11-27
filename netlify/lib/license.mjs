// Close Reader license keys: signed, so they can be checked without a database.
//
// A key looks like  CR1.<payload>.<signature>
//   payload    base64url JSON {"e": buyer email, "o": Buy Me a Coffee order id}
//   signature  Ed25519 over the ASCII text "CR1.<payload>", base64url
//
// Only the server (and scripts/close-reader-license.mjs) holds the private key; the app
// carries the public key and checks keys offline (close_reader/license.py in the app repo).
// Signing is deterministic, so the same email and order always give the same key.
import crypto from 'node:crypto'

export const PREFIX = 'CR1'

/** The private key as stored in the environment: base64 of the PKCS#8 DER bytes. */
export function loadPrivateKey(text) {
  if (!text) throw new Error('CLOSE_READER_LICENSE_PRIVATE_KEY is not set')
  return crypto.createPrivateKey({ key: Buffer.from(text.trim(), 'base64'), format: 'der', type: 'pkcs8' })
}

export function generateKeyPair() {
  const { privateKey } = crypto.generateKeyPairSync('ed25519')
  return {
    privateKey: privateKey.export({ format: 'der', type: 'pkcs8' }).toString('base64'),
    publicKey: publicKeyRaw(privateKey),
  }
}

/** The public key as the app stores it: base64 of the raw 32 bytes. */
export function publicKeyRaw(privateKey) {
  const spki = crypto.createPublicKey(privateKey).export({ format: 'der', type: 'spki' })
  return spki.subarray(spki.length - 32).toString('base64')
}

export function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase()
}

export function createLicense(privateKey, { email, order }) {
  const e = normalizeEmail(email)
  if (!e || order === undefined || order === null || order === '') {
    throw new Error('a license needs an email and an order id')
  }
  const payload = Buffer.from(JSON.stringify({ e, o: String(order) })).toString('base64url')
  const body = `${PREFIX}.${payload}`
  const signature = crypto.sign(null, Buffer.from(body), privateKey).toString('base64url')
  return `${body}.${signature}`
}

/** {email, order} for a genuine key, otherwise null. Whitespace (from email line wrapping) is ignored. */
export function readLicense(publicKey, key) {
  const parts = String(key || '').replace(/\s+/g, '').split('.')
  if (parts.length !== 3 || parts[0] !== PREFIX) return null
  const [prefix, payload, signature] = parts
  try {
    const ok = crypto.verify(null, Buffer.from(`${prefix}.${payload}`), publicKey,
                             Buffer.from(signature, 'base64url'))
    if (!ok) return null
    const { e, o } = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    return e && o ? { email: e, order: String(o) } : null
  } catch {
    return null
  }
}

// node --test scripts/test-close-reader.mjs  — the Close Reader endpoints, without Netlify.
import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import { test } from 'node:test'

import nodemailer from 'nodemailer'

import { handleDownload, handleWebhook, smtpSender } from '../netlify/lib/close-reader.mjs'
import { createLicense, generateKeyPair, loadPrivateKey, readLicense } from '../netlify/lib/license.mjs'

const pair = generateKeyPair()
const privateKey = loadPrivateKey(pair.privateKey)
const SECRET = 'whsec_test'

function memoryStore() {
  const data = new Map()
  return {
    data,
    async get(k, opts) { return data.has(k) ? (opts?.type === 'json' ? data.get(k) : JSON.stringify(data.get(k))) : null },
    async setJSON(k, v) { data.set(k, structuredClone(v)) },
  }
}

function webhookRequest(event, secret = SECRET) {
  const body = JSON.stringify(event)
  const sig = crypto.createHmac('sha256', secret).update(body).digest('hex')
  return new Request('https://techstorian.com/api/close-reader/bmc-webhook', {
    method: 'POST', body, headers: { 'x-signature-sha256': sig, 'content-type': 'application/json' },
  })
}

const purchase = (over = {}) => ({
  event_id: 7, type: 'extra_purchase.created', live_mode: true, created: 1764240000, attempt: 1,
  data: {
    id: 4242, transaction_id: 'pi_123', supporter_email: 'Jane.Doe@Example.org', supporter_name: 'Jane',
    status: 'succeeded', refunded: 'false', support_type: 'Extra',
    extras: [{ id: 603121, object: 'extra', title: 'Close Reader', amount: 15, quantity: 1 }],
  },
  ...over,
})

function setup() {
  const store = memoryStore()
  const sent = []
  let failEmail = false
  const deps = {
    secret: SECRET, privateKey, extraId: '603121', store, log: () => {},
    sendEmail: async (m) => { if (failEmail) throw new Error('smtp down'); sent.push(m) },
  }
  return { store, sent, deps, failNext: (v) => { failEmail = v } }
}

test('keys round-trip and reject tampering', () => {
  const key = createLicense(privateKey, { email: ' A@B.org ', order: 1 })
  assert.deepEqual(readLicense(privateKey, key), { email: 'a@b.org', order: '1' })
  assert.deepEqual(readLicense(privateKey, key.replace(/(.{40})/g, '$1\n  ')), { email: 'a@b.org', order: '1' })
  const [p, payload, sig] = key.split('.')
  const forged = Buffer.from(JSON.stringify({ e: 'evil@x.org', o: '1' })).toString('base64url')
  assert.equal(readLicense(privateKey, `${p}.${forged}.${sig}`), null)
  assert.equal(readLicense(loadPrivateKey(generateKeyPair().privateKey), key), null)
  assert.equal(readLicense(privateKey, 'garbage'), null)
  assert.equal(createLicense(privateKey, { email: 'a@b.org', order: 1 }), key)   // deterministic
  assert.ok(payload)
})

test('purchase: one email with a valid key, retries do not resend', async () => {
  const { store, sent, deps } = setup()
  let res = await handleWebhook(webhookRequest(purchase()), deps)
  assert.equal(res.status, 200)
  assert.equal(sent.length, 1)
  assert.equal(sent[0].to, 'jane.doe@example.org')
  assert.deepEqual(readLicense(privateKey, sent[0].key), { email: 'jane.doe@example.org', order: '4242' })
  assert.equal(store.data.get('orders/4242').emailed, true)
  res = await handleWebhook(webhookRequest(purchase({ attempt: 2 })), deps)
  res = await handleWebhook(webhookRequest(purchase({ type: 'extra_purchase.updated' })), deps)
  assert.equal(sent.length, 1)
})

test('bad signature, other items and test events are not acted on', async () => {
  const { sent, store, deps } = setup()
  assert.equal((await handleWebhook(webhookRequest(purchase(), 'wrong'), deps)).status, 401)
  const other = purchase()
  other.data.extras = [{ id: 1, title: 'Something else' }]
  assert.equal((await handleWebhook(webhookRequest(other), deps)).status, 200)
  assert.equal((await handleWebhook(webhookRequest(purchase({ live_mode: false })), deps)).status, 200)
  const donation = { type: 'donation.created', live_mode: true, data: { id: 9, supporter_email: 'x@y.z' } }
  assert.equal((await handleWebhook(webhookRequest(donation), deps)).status, 200)
  assert.equal(sent.length, 0)
  assert.equal(store.data.size, 0)
})

test('email failure answers 500 so Buy Me a Coffee retries, and the retry sends', async () => {
  const { sent, deps, failNext } = setup()
  failNext(true)
  assert.equal((await handleWebhook(webhookRequest(purchase()), deps)).status, 500)
  failNext(false)
  assert.equal((await handleWebhook(webhookRequest(purchase({ attempt: 2 })), deps)).status, 200)
  assert.equal(sent.length, 1)
})

// ------------------------------------------------------------------ download

function githubFake() {
  const calls = []
  const fetch = async (url, init) => {
    calls.push({ url, init })
    if (url.endsWith('/releases/tags/v0.2.0')) {
      return Response.json({ assets: [{ id: 77, name: 'Close-Reader-0.2.0-macOS-arm64.dmg', size: 123 }] })
    }
    if (url.endsWith('/releases/assets/77')) {
      return new Response(null, { status: 302, headers: { location: 'https://objects.example/signed?x=1' } })
    }
    return new Response('{}', { status: 404 })
  }
  return { fetch, calls }
}

const downloadRequest = (key, query = 'version=0.2.0&arch=arm64') => new Request(
  `https://techstorian.com/api/close-reader/download?${query}`,
  { headers: key ? { authorization: `Bearer ${key}` } : {} })

test('download: valid key gets the signed link', async () => {
  const { store } = setup()
  const gh = githubFake()
  const deps = { publicKey: privateKey, store, githubToken: 't', githubRepo: 'o/r', fetch: gh.fetch }
  const key = createLicense(privateKey, { email: 'a@b.org', order: 4242 })
  const res = await handleDownload(downloadRequest(key), deps)
  assert.equal(res.status, 200)
  assert.deepEqual(await res.json(), { url: 'https://objects.example/signed?x=1', name: 'Close-Reader-0.2.0-macOS-arm64.dmg', size: 123 })
  assert.equal(gh.calls[0].init.headers.authorization, 'Bearer t')
  assert.equal(gh.calls[1].init.headers.accept, 'application/octet-stream')
})

test('download: refused for missing, forged, refunded or blocked keys and bad input', async () => {
  const { store, deps: hookDeps } = setup()
  const gh = githubFake()
  const deps = { publicKey: privateKey, store, githubToken: 't', githubRepo: 'o/r', fetch: gh.fetch }
  const key = createLicense(privateKey, { email: 'jane.doe@example.org', order: 4242 })
  assert.equal((await handleDownload(downloadRequest(''), deps)).status, 401)
  assert.equal((await handleDownload(downloadRequest(key.slice(0, -4) + 'AAAA'), deps)).status, 401)
  assert.equal((await handleDownload(downloadRequest(key, 'version=../x&arch=arm64'), deps)).status, 400)
  assert.equal((await handleDownload(downloadRequest(key, 'version=0.2.0&arch=ppc'), deps)).status, 400)
  assert.equal((await handleDownload(downloadRequest(key, 'version=0.3.0&arch=arm64'), deps)).status, 404)
  assert.equal((await handleDownload(downloadRequest(key, 'version=0.2.0&arch=x86_64'), deps)).status, 404)
  assert.equal((await handleDownload(downloadRequest(key), { ...deps, revokedOrders: ['4242'] })).status, 403)
  // a refund through the webhook withdraws the key
  await handleWebhook(webhookRequest(purchase({ type: 'extra_purchase.refunded' })), hookDeps)
  const res = await handleDownload(downloadRequest(key), deps)
  assert.equal(res.status, 403)
  assert.match((await res.json()).error, /withdrawn/)
})

test('license email: sent from the Proton address, with the key in both parts', async () => {
  const transport = nodemailer.createTransport({ jsonTransport: true })
  const sent = []
  const spy = { sendMail: async (m) => { const info = await transport.sendMail(m); sent.push(JSON.parse(info.message)); return info } }
  const key = createLicense(privateKey, { email: 'a@b.org', order: 4242 })
  await smtpSender({ user: 'licenses@techstorian.com', replyTo: 'info@techstorian.com', transport: spy })({ to: 'a@b.org', key, order: '4242' })
  const m = sent[0]
  assert.deepEqual(m.from, { address: 'licenses@techstorian.com', name: 'Close Reader' })
  assert.deepEqual(m.to, [{ address: 'a@b.org', name: '' }])
  assert.deepEqual(m.replyTo, [{ address: 'info@techstorian.com', name: '' }])
  assert.equal(m.subject, 'Your Close Reader license key')
  assert.ok(m.text.includes(key) && m.html.includes(key))
  assert.equal(m.headers['X-Close-Reader-Order'], '4242')
  assert.throws(() => smtpSender({ user: '', token: '' }), /SMTP_USER/)
})

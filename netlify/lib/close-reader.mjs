// The two Close Reader endpoints, written against plain inputs so they can be tested
// without Netlify (see scripts/test-close-reader.mjs). netlify/functions/ wires them up.
import crypto from 'node:crypto'

import nodemailer from 'nodemailer'

import { createLicense, normalizeEmail, readLicense } from './license.mjs'

const json = (status, body) => new Response(JSON.stringify(body), {
  status, headers: { 'content-type': 'application/json' },
})

const ARCHES = new Set(['arm64', 'x86_64'])

// ---------------------------------------------------------------- Buy Me a Coffee webhook

/**
 * Buy Me a Coffee calls this for every payment. For a purchase of the Close Reader shop
 * item it emails the buyer a license key; for a refund it withdraws the key.
 *
 * deps: { secret, privateKey, extraId, store, sendEmail, log }
 *   store      Netlify Blobs store (get / setJSON)
 *   sendEmail  async ({ to, name, key, order }) => void, throws on failure
 *
 * Buy Me a Coffee retries a failed delivery (non-2xx) several times, so: a 500 when the
 * email could not be sent (try again later), 200 for everything that is done or ignored.
 */
export async function handleWebhook(req, deps) {
  const { secret, privateKey, extraId, store, sendEmail, log = console.log } = deps
  if (req.method !== 'POST') return json(405, { error: 'POST only' })

  const raw = await req.text()
  const given = Buffer.from(req.headers.get('x-signature-sha256') || '', 'utf8')
  const expected = Buffer.from(crypto.createHmac('sha256', secret).update(raw, 'utf8').digest('hex'), 'utf8')
  if (given.length !== expected.length || !crypto.timingSafeEqual(given, expected)) {
    return json(401, { error: 'invalid signature' })
  }

  let event
  try {
    event = JSON.parse(raw)
  } catch {
    return json(400, { error: 'invalid JSON' })
  }
  const data = event.data || {}
  const extras = Array.isArray(data.extras) ? data.extras : []
  if (!extras.some((x) => String(x.id) === String(extraId))) {
    return json(200, { ignored: 'not a Close Reader purchase' })
  }
  const order = String(data.id)
  const email = normalizeEmail(data.supporter_email)
  const refunded = event.type === 'extra_purchase.refunded' || data.status === 'refunded'
    || String(data.refunded) === 'true'

  if (!event.live_mode) {        // "Send test" in the Buy Me a Coffee dashboard
    log(`test event ${event.type} for order ${order}; nothing stored or sent`)
    return json(200, { test: true, refunded })
  }

  if (refunded) {
    await store.setJSON(`revoked/${order}`, { at: new Date().toISOString(), reason: 'refund', email })
    log(`order ${order}: refunded, license withdrawn`)
    return json(200, { revoked: order })
  }

  if (!['extra_purchase.created', 'extra_purchase.updated'].includes(event.type)) {
    return json(200, { ignored: event.type })
  }
  if (!email) {
    log(`order ${order}: no supporter_email in the payload, no license sent`)
    return json(200, { ignored: 'no email' })
  }

  const ordersKey = `orders/${order}`
  const existing = await store.get(ordersKey, { type: 'json' })
  if (existing?.emailed) return json(200, { already: order })

  const key = createLicense(privateKey, { email, order })
  const record = {
    email, order, key,
    name: data.supporter_name || '',
    transaction: data.transaction_id || '',
    created: existing?.created || new Date().toISOString(),
    emailed: false,
  }
  await store.setJSON(ordersKey, record)
  try {
    await sendEmail({ to: email, name: record.name, key, order })
  } catch (err) {
    log(`order ${order}: email to ${email} failed: ${err.message}`)
    return json(500, { error: 'email failed; will be retried' })
  }
  await store.setJSON(ordersKey, { ...record, emailed: true })
  log(`order ${order}: license emailed to ${email}`)
  return json(200, { sent: order })
}

// ---------------------------------------------------------------- update download

/**
 * The app asks here for an update:  GET ?version=0.2.0&arch=arm64  with
 * "Authorization: Bearer <license key>". A valid key gets a short-lived link to the .dmg,
 * which is an asset of the GitHub release v<version> in the private app repository.
 *
 * deps: { publicKey, store, revokedOrders, githubToken, githubRepo, fetch }
 */
export async function handleDownload(req, deps) {
  const { publicKey, store, revokedOrders = [], githubToken, githubRepo, fetch = globalThis.fetch } = deps
  const key = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '')
  const license = readLicense(publicKey, key)
  if (!license) return json(401, { error: 'This license key is not valid.' })
  if (revokedOrders.includes(license.order) || await store.get(`revoked/${license.order}`)) {
    return json(403, { error: 'This license key has been withdrawn. Write to info@techstorian.com if you think this is a mistake.' })
  }

  const params = new URL(req.url).searchParams
  const version = params.get('version') || ''
  const arch = params.get('arch') || ''
  if (!/^\d+(\.\d+){0,3}$/.test(version) || !ARCHES.has(arch)) {
    return json(400, { error: 'Unknown version or architecture.' })
  }
  const name = `Close-Reader-${version}-macOS-${arch}.dmg`

  const github = (path, accept = 'application/vnd.github+json') => fetch(
    `https://api.github.com/repos/${githubRepo}${path}`, {
      headers: {
        authorization: `Bearer ${githubToken}`,
        accept,
        'x-github-api-version': '2022-11-28',
        'user-agent': 'techstorian-close-reader',
      },
      redirect: 'manual',
    })

  const release = await github(`/releases/tags/v${version}`)
  if (release.status === 404) return json(404, { error: `Version ${version} is not available for download.` })
  if (!release.ok) return json(502, { error: `The download server could not be reached (${release.status}).` })
  const asset = ((await release.json()).assets || []).find((a) => a.name === name)
  if (!asset) return json(404, { error: `There is no download of version ${version} for this Mac (${arch}).` })

  // GitHub answers with a redirect to a signed link that works for a few minutes
  const file = await github(`/releases/assets/${asset.id}`, 'application/octet-stream')
  const url = file.headers.get('location')
  if (file.status < 300 || file.status >= 400 || !url) {
    return json(502, { error: `The download server could not be reached (${file.status}).` })
  }
  return json(200, { url, name, size: asset.size })
}

// ---------------------------------------------------------------- email (Proton Mail, SMTP)

export function licenseEmail({ key }) {
  const text = `Thank you for buying Close Reader.

Your license key:

${key}

Keep this email. The key gives you every future update of Close Reader.

To use it, open Close Reader, choose Help > Enter license key… and paste the key.
When a new version comes out, Close Reader offers to download it for you.

Questions? Just reply to this email.

techstorian
https://techstorian.com/close-reader/
`
  const html = `<p>Thank you for buying Close Reader.</p>
<p>Your license key:</p>
<p style="font-family: Menlo, Consolas, monospace; font-size: 13px; word-break: break-all; background: #f4efe6; padding: 12px; border-radius: 4px;">${key}</p>
<p>Keep this email. The key gives you every future update of Close Reader.</p>
<p>To use it, open Close Reader, choose <b>Help ▸ Enter license key…</b> and paste the key.
When a new version comes out, Close Reader offers to download it for you.</p>
<p>Questions? Just reply to this email.</p>
<p>techstorian<br><a href="https://techstorian.com/close-reader/">techstorian.com/close-reader</a></p>`
  return { subject: 'Your Close Reader license key', text, html }
}

// Proton's SMTP submission: the user is the custom-domain address the token belongs to
// (Proton ▸ Settings ▸ IMAP/SMTP ▸ SMTP tokens), and mail is sent from that address.
// Buy Me a Coffee waits 15 s for an answer, so the timeouts stay well below that.
export const SMTP = { host: 'smtp.protonmail.ch', port: 587 }

export function smtpSender({ user, token, replyTo, transport }) {
  if (!transport && (!user || !token)) throw new Error('SMTP_USER and SMTP_TOKEN must be set')
  const mailer = transport || nodemailer.createTransport({
    ...SMTP,
    secure: false,
    requireTLS: true,                     // STARTTLS, never plain text
    auth: { user, pass: token },
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 8000,
  })
  return async ({ to, key, order }) => {
    const { subject, text, html } = licenseEmail({ key })
    await mailer.sendMail({
      from: { name: 'Close Reader', address: user },
      to,
      replyTo: replyTo || undefined,
      subject,
      text,
      html,
      headers: { 'X-Close-Reader-Order': String(order) },
    })
  }
}

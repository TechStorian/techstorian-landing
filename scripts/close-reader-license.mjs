#!/usr/bin/env node
// Close Reader license keys by hand.
//
//   node scripts/close-reader-license.mjs keygen                 once: create the signing key pair
//   node scripts/close-reader-license.mjs issue <email> <order>  a key for a buyer (e.g. earlier buyers)
//   node scripts/close-reader-license.mjs email <email> <order>  issue a key and email it, as the webhook does
//   node scripts/close-reader-license.mjs verify <key>           who a key belongs to
//
// "email" sends through Proton like the webhook, with SMTP_USER and SMTP_TOKEN (and optionally
// LICENSE_EMAIL_REPLY_TO) in the environment. Try it on yourself first to test the token.
//
// The private key is read from CLOSE_READER_LICENSE_PRIVATE_KEY, or else from the file that
// keygen writes (~/.techstorian/close-reader-license.key). Keys are deterministic: issuing
// again for the same email and order gives the same key as the webhook sent.
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

import { smtpSender } from '../netlify/lib/close-reader.mjs'
import { createLicense, generateKeyPair, loadPrivateKey, publicKeyRaw, readLicense } from '../netlify/lib/license.mjs'

const KEY_FILE = path.join(os.homedir(), '.techstorian', 'close-reader-license.key')

function privateKey() {
  const text = process.env.CLOSE_READER_LICENSE_PRIVATE_KEY
    || (fs.existsSync(KEY_FILE) && fs.readFileSync(KEY_FILE, 'utf8'))
  if (!text) {
    console.error(`No private key: set CLOSE_READER_LICENSE_PRIVATE_KEY or run "keygen" (writes ${KEY_FILE}).`)
    process.exit(1)
  }
  return loadPrivateKey(text)
}

const [command, ...args] = process.argv.slice(2)

if (command === 'keygen') {
  if (fs.existsSync(KEY_FILE)) {
    console.error(`${KEY_FILE} already exists. A new key pair would invalidate every key sold so far;\n`
      + 'delete the file yourself if that is really what you want.')
    process.exit(1)
  }
  const pair = generateKeyPair()
  fs.mkdirSync(path.dirname(KEY_FILE), { recursive: true, mode: 0o700 })
  fs.writeFileSync(KEY_FILE, pair.privateKey + '\n', { mode: 0o600 })
  console.log(`Private key written to ${KEY_FILE} (keep it safe and out of git).

1. In Netlify ▸ Site configuration ▸ Environment variables, add
     CLOSE_READER_LICENSE_PRIVATE_KEY = (the contents of that file)

2. In the app repo, set close_reader/license.py:
     PUBLIC_KEY = "${pair.publicKey}"`)
} else if (command === 'issue' && args.length === 2) {
  const key = privateKey()
  const license = createLicense(key, { email: args[0], order: args[1] })
  console.log(license)
  console.error(`\n(public key: ${publicKeyRaw(key)})`)
} else if (command === 'email' && args.length === 2) {
  const license = createLicense(privateKey(), { email: args[0], order: args[1] })
  const send = smtpSender({
    user: process.env.SMTP_USER, token: process.env.SMTP_TOKEN, replyTo: process.env.LICENSE_EMAIL_REPLY_TO,
  })
  await send({ to: args[0], key: license, order: args[1] })
  console.log(`Sent to ${args[0]} from ${process.env.SMTP_USER}:\n${license}`)
} else if (command === 'verify' && args.length >= 1) {
  const license = readLicense(privateKey(), args.join(''))
  console.log(license ? `valid: ${license.email}, order ${license.order}` : 'NOT a valid key')
  process.exit(license ? 0 : 1)
} else {
  console.error('usage: close-reader-license.mjs keygen | issue <email> <order> | email <email> <order> | verify <key>')
  process.exit(2)
}

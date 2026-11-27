// POST /api/close-reader/bmc-webhook — Buy Me a Coffee purchase/refund notifications.
// Environment (Netlify ▸ Site configuration ▸ Environment variables):
//   BMC_WEBHOOK_SECRET                 the webhook's signing secret (Buy Me a Coffee dashboard)
//   CLOSE_READER_LICENSE_PRIVATE_KEY   from: node scripts/close-reader-license.mjs keygen
//   CLOSE_READER_BMC_EXTRA_ID          the shop item's id (default 603121, from its URL)
//   SMTP_USER                          the Proton address the email is sent from
//   SMTP_TOKEN                         its SMTP token (Proton ▸ Settings ▸ IMAP/SMTP)
//   LICENSE_EMAIL_REPLY_TO             optional, e.g. info@techstorian.com
import { getStore } from '@netlify/blobs'

import { handleWebhook, smtpSender } from '../lib/close-reader.mjs'
import { loadPrivateKey } from '../lib/license.mjs'

export default async (req) => handleWebhook(req, {
  secret: process.env.BMC_WEBHOOK_SECRET,
  privateKey: loadPrivateKey(process.env.CLOSE_READER_LICENSE_PRIVATE_KEY),
  extraId: process.env.CLOSE_READER_BMC_EXTRA_ID || '603121',
  store: getStore('close-reader-licenses'),
  sendEmail: smtpSender({
    user: process.env.SMTP_USER,
    token: process.env.SMTP_TOKEN,
    replyTo: process.env.LICENSE_EMAIL_REPLY_TO,
  }),
})

export const config = { path: '/api/close-reader/bmc-webhook' }

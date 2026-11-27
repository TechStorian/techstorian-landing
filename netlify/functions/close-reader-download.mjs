// GET /api/close-reader/download?version=…&arch=… — the app fetches updates here.
// Environment (Netlify ▸ Site configuration ▸ Environment variables):
//   CLOSE_READER_LICENSE_PRIVATE_KEY   the same key the webhook signs with
//   CLOSE_READER_GITHUB_TOKEN          fine-grained token: Contents read-only on the app repo
//   CLOSE_READER_GITHUB_REPO           default TechStorian/close-reader
//   CLOSE_READER_REVOKED_ORDERS        optional, comma-separated order ids to block by hand
import { getStore } from '@netlify/blobs'

import { handleDownload } from '../lib/close-reader.mjs'
import { loadPrivateKey } from '../lib/license.mjs'

export default async (req) => handleDownload(req, {
  publicKey: loadPrivateKey(process.env.CLOSE_READER_LICENSE_PRIVATE_KEY),  // verifies too
  store: getStore('close-reader-licenses'),
  revokedOrders: (process.env.CLOSE_READER_REVOKED_ORDERS || '').split(',').map((s) => s.trim()).filter(Boolean),
  githubToken: process.env.CLOSE_READER_GITHUB_TOKEN,
  githubRepo: process.env.CLOSE_READER_GITHUB_REPO || 'TechStorian/close-reader',
})

export const config = { path: '/api/close-reader/download' }

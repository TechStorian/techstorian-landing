# techstorian-landing

The main website for **techstorian** — research software for cultural heritage, made by
Victor Harbo Johnston. Built with Vue 3, Vite and TypeScript.

## Development

```sh
npm install
npm run dev      # local dev server
npm run build    # type-check and build to dist/
npm run preview  # serve the production build
```

## Editing content

All copy and links (products, open-source projects, essays, founder bio, contact email) live in
[`src/content.ts`](src/content.ts). The page sections are in `src/components/`, and the colour and
type tokens (with a dark-mode variant) are in [`src/assets/main.css`](src/assets/main.css).

## Pages

Each page is its own HTML entry (listed in [`vite.config.ts`](vite.config.ts)), so it builds to a
plain folder that any static host can serve:

- `/` — [`index.html`](index.html) → `src/App.vue`
- `/close-reader/` — [`close-reader/index.html`](close-reader/index.html) → `src/CloseReaderPage.vue`

The oxblood accent (`#5a2a22`) is shared with [exorCITE](https://refcheck.techstorian.com/).

## Close Reader licenses and updates

Close Reader is sold on Buy Me a Coffee. Two Netlify Functions add license keys and
licensed update downloads (the app side is described in the close-reader repository):

- `POST /api/close-reader/bmc-webhook` ([`netlify/functions/close-reader-webhook.mjs`](netlify/functions/close-reader-webhook.mjs))
  receives Buy Me a Coffee's notifications. For a purchase of the Close Reader shop item it
  emails the buyer a license key (through Proton Mail's SMTP); for a refund it
  withdraws the key. Other payments are ignored, and a repeated notification never sends a
  second email.
- `GET /api/close-reader/download?version=…&arch=…` ([`netlify/functions/close-reader-download.mjs`](netlify/functions/close-reader-download.mjs))
  is called by the app with the key. A valid key gets a short-lived link to the `.dmg`,
  which is an asset of the GitHub release `v<version>` of the private close-reader repository.
- `public/close-reader/latest.json` is the public file the app checks for new versions.
  The close-reader repository's `packaging/make_update_json.py` writes it.

Keys are signed (Ed25519), so the app can check them offline and no database is needed.
Issued keys and withdrawn ones are recorded in the Netlify Blobs store `close-reader-licenses`.
The code is in [`netlify/lib/`](netlify/lib/); `npm test` runs its tests.

### Setup (once)

1. **Signing key.** `node scripts/close-reader-license.mjs keygen` writes the private key to
   `~/.techstorian/close-reader-license.key` and prints the public key. Put the public key in
   the close-reader repository's `close_reader/license.py` (`PUBLIC_KEY`). Never generate a
   new pair once keys are sold: it would invalidate all of them.
2. **Email.** In Proton, Settings ▸ All settings ▸ Proton Mail ▸ IMAP/SMTP ▸ SMTP tokens,
   create a token for the address the license emails should come from (for example
   `licenses@techstorian.com`; it must be a techstorian.com address in Proton). Each sent
   email lands in that address's Sent folder.
3. **GitHub token.** A fine-grained personal access token with access to only
   `TechStorian/close-reader` and the permission *Contents: Read-only*.
4. **Netlify environment variables** (Site configuration ▸ Environment variables):

   | Variable | Value |
   |---|---|
   | `CLOSE_READER_LICENSE_PRIVATE_KEY` | contents of `~/.techstorian/close-reader-license.key` |
   | `BMC_WEBHOOK_SECRET` | the webhook's signing secret (step 5) |
   | `SMTP_USER` | the Proton address from step 2, e.g. `licenses@techstorian.com` |
   | `SMTP_TOKEN` | its SMTP token |
   | `LICENSE_EMAIL_REPLY_TO` | e.g. `info@techstorian.com` (optional) |
   | `CLOSE_READER_GITHUB_TOKEN` | the token from step 3 |
   | `CLOSE_READER_BMC_EXTRA_ID` | optional; the shop item id, default `603121` |
   | `CLOSE_READER_REVOKED_ORDERS` | optional; comma-separated order ids to block by hand |

5. **Buy Me a Coffee webhook.** In the Buy Me a Coffee dashboard, add a webhook to
   `https://techstorian.com/api/close-reader/bmc-webhook` for the events
   `extra_purchase.created`, `extra_purchase.updated` and `extra_purchase.refunded`, and copy
   its signing secret into `BMC_WEBHOOK_SECRET`. A test event from the dashboard is
   acknowledged but stores and sends nothing (see the function log in Netlify).

### By hand

- **Buyers from before the keys existed**, or a lost key:
  `node scripts/close-reader-license.mjs issue buyer@example.org <order id>` prints their key.
  Keys are deterministic, so this reproduces the key a buyer was sent. The order id is
  the payment id in Buy Me a Coffee; for earlier buyers, any id you note down will do.
- **Email a key from your Mac**, through Proton exactly as the webhook does:
  `SMTP_USER=licenses@techstorian.com SMTP_TOKEN=… node scripts/close-reader-license.mjs email buyer@example.org <order id>`.
  Send one to yourself first: it tests the token before you deploy.
- **Who a key belongs to:** `node scripts/close-reader-license.mjs verify <key>`.
- **Block a key** (shared publicly, say): add its order id to `CLOSE_READER_REVOKED_ORDERS`.

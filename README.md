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

The oxblood accent (`#5a2a22`) is shared with [RefCheck](https://refcheck.techstorian.com/).

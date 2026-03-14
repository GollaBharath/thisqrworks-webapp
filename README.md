# thisqr.works

`thisqr.works` is a static, browser-first QR toolkit.

Core idea: fast tools, no signup, no account flow.

## What Is Included

- `QR Generator` (`/qr/`): Generate QR codes from text or URLs and export SVG.
- `Custom QR` (`/custom/`): Style QR codes (colors, geometry, gradients) and export.
- `QR Decoder` (`/decode/`): Decode QR content from image upload or camera scan.
- `Social Media QR` (`/socials/create.html`): Build one QR that points to your socials profile.

## Project Structure

```text
/                     # Homepage / tool index
/qr/                  # Basic QR generator
/custom/              # Styled/custom QR generator
/decode/              # QR decoder (upload + camera)
/socials/             # Social profile + social QR creator
/main.css             # Homepage styles
/customize-link-helper.js
/robots.txt
/sitemap.xml
/SEO-IMPLEMENTATION.md
```

## Local Development

This is a static site, so any static server works.

### Option 1: Python

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080`.

### Option 2: Node (if `npx` is available)

```bash
npx serve .
```

## Deployment

Deploy to any static host:

- GitHub Pages
- Netlify
- Vercel (static)
- Cloudflare Pages

Ensure these files remain at the site root after deploy:

- `robots.txt`
- `sitemap.xml`
- `favicon.ico`, `favicon.svg`, `apple-touch-icon.png`

## Notes

- Most features run client-side in the browser.
- Camera-based decode requires HTTPS in production (or localhost in development).
- SEO metadata and structured data are implemented across tool pages.

## Add A New Tool

1. Create a folder like `/my-tool/`.
2. Add `index.html`, `style.css`, and `script.js`.
3. Add a card/link on root `index.html`.
4. Add canonical/meta/schema markup for SEO consistency.
5. Update `sitemap.xml` if the new page should be indexed.

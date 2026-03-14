# thisqr.works Context (March 14, 2026)

## Why this file exists

This is a handoff note for future edits so work can continue without re-discovering previous decisions.

## Primary goals from the recent SEO/content pass

- Refactor SEO and visible text across the site.
- Keep copy minimalist and action-first.
- Do not change visual design or UI structure.
- Make FAQ/explainer content compact using dropdown behavior.
- Improve discoverability for brand-variant queries:
  - `thisqrworks`
  - `this qr works`
  - `working qr`

## Constraints that were explicitly followed

- No redesign.
- No major layout changes.
- Keep the current look and interaction patterns.
- Improve clarity and scan-ability by reducing text volume.

## What was implemented (high level)

- Shortened copy on key pages to reduce friction and improve clarity.
- Added/updated SEO metadata across major pages:
  - `title`
  - `meta description`
  - `meta keywords`
  - `canonical`
  - robots directives where needed
  - Open Graph and Twitter card metadata
- Updated schema markup (JSON-LD) on key pages to better describe tools/site.
- Added compact FAQ/explainer patterns using `<details>/<summary>`.
- Updated `sitemap.xml` `lastmod` values to `2026-03-14` for key URLs.
- Set redirect-only page behavior to avoid thin-content indexing (`noindex, follow`) where appropriate.

## Current key pages and intent

- `index.html`: Main landing page, concise value proposition, compact FAQ, broad SEO targeting.
- `qr/index.html`: QR generator landing, minimal copy + generator-intent SEO.
- `decode/index.html`: Decoder landing, minimal copy + scan/decode intent.
- `custom/index.html`: Custom QR creator, styling/customization intent.
- `socials/create.html`: Social links QR creator, concise form guidance.
- `socials/profile.html`: Social profile viewer, compact explainer.
- `socials/index.html`: Redirect shell behavior (indexing controlled to avoid thin content).

## UI/content pattern chosen for compactness

- Use `<details>/<summary>` for FAQ and optional explainers.
- Keep default visible text short and task-focused.
- Move supporting context behind expandable sections.

## SEO positioning used

- Brand + utility framing:
  - `thisqr.works`
  - `thisqrworks`
  - `this qr works`
  - `working qr`
- Tool-intent keyword families per page:
  - Generate QR
  - Decode QR
  - Custom QR
  - Social media QR
- Keep titles/descriptions readable first, keyword-supportive second.

## Validation status from the previous pass

- Workspace diagnostics were checked and reported no errors at that time.
- Final verification reads confirmed concise copy + metadata/schema updates.

## Important note about repo state

- At one point, git change output showed unexpectedly large diffs including vendor-like/bundled files; do not assume those are all intentional SEO changes.
- Always re-check actual file contents before making follow-up edits.

## Delta check performed before writing this file

The following files were re-read to account for possible user/formatter changes before creating this context note:

- `index.html`
- `socials/create.html`
- `socials/profile.html`
- `sitemap.xml`

## Suggested next operational steps

1. Deploy these content/SEO changes.
2. Re-submit or ping `sitemap.xml` in search tooling.
3. Monitor impressions/clicks for brand variants and tool-intent queries.
4. Iterate titles/descriptions based on real query data and CTR.

# thisqr.works

**thisqr.works** is a collection of QR-first tools—simple, privacy-respecting utilities that work without login, tracking, or unnecessary complexity.

> Static web project for thisqr.works

## Philosophy

- No login required
- No user accounts
- No tracking (beyond basic analytics)
- No server-side data storage
- Fast, client-side processing
- SEO-friendly
- Simple, honest explanations

## Structure

The repository is organized with each tool in its own directory:

```
/                 → Main homepage / tool directory
/socials/         → Share Your Socials tool
```

### Available Tools

#### Share Your Socials (`/socials/`)

Create a single QR code that displays all your social media handles. Data is encoded directly into the QR code—no signup, no server storage.

## Development

This is a static site. Simply open `index.html` in a browser or serve via any static web server.

## Adding New Tools

To add a new tool:

1. Create a new directory: `/toolname/`
2. Add your tool's HTML, CSS, JS to that directory
3. Update the root `index.html` to list the new tool

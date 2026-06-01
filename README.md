# Eric Handal Portfolio

Astro portfolio site deployed on Cloudflare Workers with static assets.

## Commands

```sh
npm install
npm run dev
npm run build
```

## Visitor Counter

The site includes a Cloudflare Worker endpoint at `/api/visits` that records page visits in a Cloudflare D1 database.

### Cloudflare Setup

1. Create a D1 database in Cloudflare.
2. In the Cloudflare project, add a D1 binding:
   - Binding name: `DB`
   - Database: the D1 database created for this site
3. Use this deploy command:

```sh
npx wrangler versions upload src/worker.js --assets=./dist --compatibility-date 2026-06-01
```

The Worker creates its `counters` table automatically on first request.

### API

- `GET /api/visits` returns the current count without incrementing it.
- `POST /api/visits` increments the site visit counter and returns the new count.

The front end calls `POST /api/visits` when the page loads and displays the result in the footer.

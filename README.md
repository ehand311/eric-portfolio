# Eric Handal Portfolio

Astro portfolio site deployed on Cloudflare Pages.

## Commands

```sh
npm install
npm run dev
npm run build
```

## Visitor Counter

The site includes a Cloudflare Pages Function at `/api/visits` that records page visits in a Cloudflare D1 database.

### Cloudflare Setup

1. Create a D1 database in Cloudflare.
2. In the Cloudflare Pages project, add a D1 binding:
   - Binding name: `DB`
   - Database: the D1 database created for this site
3. Deploy the site.

The function creates its `counters` table automatically on first request.

### API

- `GET /api/visits` returns the current count without incrementing it.
- `POST /api/visits` increments the site visit counter and returns the new count.

The front end calls `POST /api/visits` when the page loads and displays the result in the footer.

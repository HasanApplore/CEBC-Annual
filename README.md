# CEBC Annual Summit — Monorepo

Three apps sharing one MongoDB database:

```
apps/
  frontend/   Vite + React + TS public site (fetches content from the API)
  backend/    Express + Mongoose API — content CRUD, uploads, registrations
  admin/      Next.js admin panel — edit homepage content, manage speakers/
              sponsors/partners/agenda/gallery, view registrations
```

Managed as npm workspaces from the root `package.json`.

## Setup

```bash
npm install                     # installs all three apps' dependencies
cp apps/backend/.env.example apps/backend/.env   # fill in MONGODB_URI, JWT_SECRET, seed admin creds
npm run seed:backend            # creates the admin account + seeds initial content
```

`apps/admin/.env.local` and `apps/frontend/.env.local` already point at
`http://localhost:4000/api` for local development.

## Running locally

```bash
npm run dev:backend             # http://localhost:4000
npm run dev:admin               # http://localhost:3000 — log in with the seeded admin
npm run dev:frontend            # http://localhost:5173 — public site
```

## What's editable from the admin panel

- **Site Content** — hero, event info, about section heading/subheading, gallery header, footer
- **Agenda** — schedule rows
- **Speakers**, **Sponsors** (by tier), **Partners** — add/edit/delete/reorder
- **Gallery** — photos on the `/gallery` page
- **Registrations** — read-only list of attendees who submitted the Register form, with CSV export

Images/videos can be uploaded directly from the admin panel (stored on the
backend under `apps/backend/uploads/`) or set as a plain URL.

## Payments

Not yet integrated — the Register form's "Payment" step is still an explicit
placeholder, as before. The `Registration` model already has `paymentStatus`/
`amount`/`ticketType` fields reserved so wiring in a gateway later won't
require a schema change.

## Production notes

- The backend's local-disk upload storage (`apps/backend/uploads/`) is fine
  for development but won't persist across most hosting platforms' deploys —
  swap in S3/Cloudinary before going to production.
- Rotate `MONGODB_URI`/`JWT_SECRET`/the seeded admin password before shipping;
  the current `.env` values were set up for local development.

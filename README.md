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
- **Payments** — set the checkout link (e.g. a Stripe Payment Link) sent to attendees from the
  Register form's payment step, and see each registrant's payment status (read-only)

Images/videos can be uploaded directly from the admin panel — files go to
AWS S3 (`applore-dev-projects-5`, `ap-south-1`, under the `cebc/uploads/`
prefix) and come back as a public HTTPS URL — or set as a plain URL.

## Payments

Registering never requires payment to succeed — the Register form saves the
attendee's details first, then sends them to the payment link (stored in
`SiteContent.paymentLink`, editable from the admin's Payments page) as a
separate step. There's no gateway webhook wired up yet, so every
`Registration` starts and stays `paymentStatus: "pending"` until that's
built — the admin panel intentionally has no way to mark one "paid" manually.

## Production notes

- Rotate `MONGODB_URI`/`JWT_SECRET`/the seeded admin password/AWS keys before
  shipping; the current `.env` values were set up for local development.
- The `applore-dev-projects-5` S3 bucket is shared across multiple projects —
  this app only ever writes under the `cebc/uploads/` prefix within it.
- `apps/backend/uploads/` (local disk) is no longer written to by new
  uploads, but is still served for any files uploaded before the S3 switch.

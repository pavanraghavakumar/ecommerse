# Online Shopping App

An Amazon-like online store: shoppers browse, search and filter products, keep a
cart and a wishlist, sign in with email and password, check out by card, and see
their own orders. Store staff (Admins) manage products, orders and shoppers, and
read the sales and stock reports, in an admin dashboard.

One Next.js application (App Router, TypeScript): the storefront and the admin
dashboard are React pages, the API is Next.js route handlers in the same
codebase, and the data lives in a SQLite file read and written through Prisma.

## Build and run

Install: `npm install`

Test: `npm test`

Run locally: yes

Dev: `npm run dev`

Port variable: `PORT`

Health path: `/api/health`

Deploy: ssh-docker

`npm run dev` applies the migrations (`prisma migrate deploy`), runs the seed
script (which seeds only an empty database and never in production), creates the
first Admin from `FIRST_ADMIN_EMAIL` and `FIRST_ADMIN_PASSWORD` when both are set
and no account exists, then starts `next dev` on `process.env.PORT` (3000 when it
is not set).

`npm test` runs `vitest run` once and exits. Each test file starts its own SQLite
database in a temporary folder and applies the migrations to it, so no test needs
a database someone started.

## Configuration

Copy `.env.example` to `.env` and fill in the values:

| Variable | What it is |
| --- | --- |
| `DATABASE_URL` | The SQLite file, such as `file:./dev.db` (relative to `prisma/`) |
| `SESSION_SECRET` | The secret that signs the session cookie |
| `PAYMENT_PROVIDER_KEY` | The payment provider key (test mode) |
| `PAYMENT_PROVIDER_SECRET` | The payment provider secret (test mode) |
| `FIRST_ADMIN_EMAIL` | The first Admin's email, created after the migrations |
| `FIRST_ADMIN_PASSWORD` | The first Admin's password |

## Test logins

The seed script creates these two accounts, about 500 active products across 8
categories, and three sample orders for the Shopper, only when the database has
no account yet and `NODE_ENV` is not `production`.

- Admin — `admin@shop.test` / `Admin1234`
- Shopper — `shopper@shop.test` / `Shopper1234`

## Payments

`lib/payments.ts` wraps the payment provider in test mode. `charge(amountCents,
card)` answers `confirmed`, `declined` or `unavailable`, with a 30-second
timeout. A card number ending in `0002` is declined, and a provider key of
`unavailable` makes the call fail, so both paths can be tried without the
network.

## Project layout

- `app/` — pages and API route handlers
- `lib/` — the Prisma client, sessions, auth checks, payments and the audit log
- `prisma/` — the schema, the migrations, the seed script and the first-Admin script
- `e2e/` — Playwright journeys, run through `run_journeys`

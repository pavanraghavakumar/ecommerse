# Tasks: Online Shopping App

- [ ] 1. Project setup
  - [ ] 1.1 Project setup
    - Create the Next.js (App Router, TypeScript) app with Vitest and Testing Library, the Prisma schema of `design.md` (Account, Product, Cart, CartLine, WishlistItem, Order, OrderLine, AuditLog) and its first migration, `lib/db.ts`, `lib/session.ts` (signed HTTP-only cookie with account id and role), `lib/auth.ts` (`getSession`, `requireShopper`, `requireAdmin`), `lib/payments.ts` (`charge` returning confirmed, declined or unavailable, card ending 0002 declined, key `unavailable` failing, 30-second timeout), `lib/audit.ts`, `app/api/health/route.ts` (200 with `{"status":"ok"}`, 503 when the database does not answer), the shared stylesheet with the colours and font of `## Look and feel` as CSS variables, the root layout with the store header (store name, search field, cart and wishlist icons, account links), `README.md` with the commands of `## Build and run`, `.gitignore` with `.env`, `.env.example` (`DATABASE_URL`, `SESSION_SECRET`, `PAYMENT_PROVIDER_KEY`, `PAYMENT_PROVIDER_SECRET`, `FIRST_ADMIN_EMAIL`, `FIRST_ADMIN_PASSWORD`), the seed script (about 500 active products across 8 categories, the Admin and Shopper test logins, three sample orders for the Shopper; only on an empty database and never when `NODE_ENV` is production), the first-Admin creation from `FIRST_ADMIN_EMAIL` and `FIRST_ADMIN_PASSWORD` after the migrations, `npm run dev` (migrate deploy, then seed, then `next dev` on `process.env.PORT`), `npm test` (`vitest run`), and `@playwright/test` with an `e2e/` folder holding `.gitkeep`, excluded from Vitest.
    - _Requirements: 8.4_
    - _Files: package.json, package-lock.json, tsconfig.json, next.config.ts, vitest.config.ts, vitest.setup.ts, playwright.config.ts, .gitignore, .env.example, README.md, prisma/**, lib/db.ts, lib/session.ts, lib/auth.ts, lib/payments.ts, lib/audit.ts, lib/__tests__/**, app/layout.tsx, app/globals.css, app/api/health/route.ts, e2e/.gitkeep_
    - _Verify: npm install_
    - _Verify: npm test_
    - _Verify: npx tsc --noEmit_
    - _Area: setup_

- [ ] 2. Product listings and product page
  - [ ] 2.1 Product listings and product page
    - Build the listings at `/` (24 active in-stock products per page with image, name, price and category; search box; category, minimum price, maximum price and sort filters; the number found; "No products found" with a link back; a Filters button opening a full-height panel on a phone and a 240px filter column on a desktop; pagination) and the product page at `/products/[id]` (image, name, price, description, category, stock status, Add to cart, heart; "This product is not available" with no Add to cart for a hidden or out-of-stock product), with `GET /api/products` and `GET /api/products/[id]` and their own styles.
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 8.2_
    - _Depends: 1_
    - _Files: app/page.tsx, app/page.module.css, app/products/[id]/page.tsx, app/products/[id]/page.module.css, app/api/products/route.ts, app/api/products/[id]/route.ts, lib/products.ts, components/ProductCard.tsx, components/ProductCard.module.css, components/ProductFilters.tsx, components/ProductFilters.module.css, components/Pagination.tsx, components/Pagination.module.css, lib/__tests__/products.test.ts, app/api/products/__tests__/products.test.ts_
    - _Verify: npm test -- products_
    - _Verify: npx tsc --noEmit_
    - _Area: ui_

- [ ] 3. Sign in and register
  - [ ] 3.1 Sign in and register
    - Build the sign-in page at `/signin` and the registration page at `/register` (name, email, password of at least 8 characters, delivery address), the `next` return after sign-in, the signed-in header with the person's name and links to cart, wishlist and orders plus Sign out, the sign-in redirect for `/cart`, `/wishlist`, `/checkout` and `/orders`, and the "You do not have access to this page" message for a Shopper on an admin page, with `POST /api/auth/register`, `POST /api/auth/signin` and `POST /api/auth/signout`, and their own styles.
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8_
    - _Depends: 1_
    - _Files: app/signin/page.tsx, app/signin/page.module.css, app/register/page.tsx, app/register/page.module.css, app/api/auth/register/route.ts, app/api/auth/signin/route.ts, app/api/auth/signout/route.ts, lib/accounts.ts, components/AuthForm.tsx, components/AuthForm.module.css, components/HeaderAccount.tsx, components/HeaderAccount.module.css, lib/__tests__/accounts.test.ts, app/api/auth/__tests__/auth.test.ts_
    - _Verify: npm test -- auth_
    - _Verify: npx tsc --noEmit_
    - _Area: api_

- [ ] 4. Cart
  - [ ] 4.1 Cart
    - Build the cart page at `/cart` (each line with image, name, unit price, quantity stepper, line total and Remove; the cart total; a sticky total and Checkout bar on a phone and a summary card on a desktop; "No longer available" lines left out of the total and blocking checkout; "Only N left in stock"; "Your cart is empty"), the browser cart for a signed-out shopper moved into the account's cart at sign-in, and `GET`, `POST`, `PATCH` and `DELETE /api/cart` plus `POST /api/cart/merge`, with their own styles.
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_
    - _Depends: 1, 3_
    - _Files: app/cart/page.tsx, app/cart/page.module.css, app/api/cart/route.ts, app/api/cart/[productId]/route.ts, app/api/cart/merge/route.ts, lib/cart.ts, lib/browserCart.ts, components/CartLine.tsx, components/CartLine.module.css, components/QuantityStepper.tsx, components/QuantityStepper.module.css, lib/__tests__/cart.test.ts, app/api/cart/__tests__/cart.test.ts_
    - _Verify: npm test -- cart_
    - _Verify: npx tsc --noEmit_
    - _Area: api_

- [ ] 5. Wishlist
  - [ ] 5.1 Wishlist
    - Build the wishlist page at `/wishlist` (saved products newest first in the listings card grid, each with Add to cart and Remove; "Your wishlist is empty" with a link to the listings), the heart on the product card and the product page that fills and empties, and `GET`, `POST` and `DELETE /api/wishlist`, with their own styles.
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
    - _Depends: 1, 3_
    - _Files: app/wishlist/page.tsx, app/wishlist/page.module.css, app/api/wishlist/route.ts, app/api/wishlist/[productId]/route.ts, lib/wishlist.ts, components/WishlistHeart.tsx, components/WishlistHeart.module.css, lib/__tests__/wishlist.test.ts, app/api/wishlist/__tests__/wishlist.test.ts_
    - _Verify: npm test -- wishlist_
    - _Verify: npx tsc --noEmit_
    - _Area: api_

- [ ] 6. Checkout and card payment
  - [ ] 6.1 Checkout and card payment
    - Build the checkout page at `/checkout` (delivery address, order lines, order total, card form; the total and Pay button in a sticky bar on a phone and an order summary card on a desktop; "Your cart is empty" with no form; the declined and the not-confirmed messages with the cart kept as it was) and the order confirmation page at `/orders/[id]/confirmation` (order number and total), with `POST /api/checkout` charging the provider in one transaction, placing the order as paid, emptying the cart and reducing stock only on a confirmed payment, and their own styles.
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 8.3_
    - _Depends: 1, 3, 4_
    - _Files: app/checkout/page.tsx, app/checkout/page.module.css, app/orders/[id]/confirmation/page.tsx, app/orders/[id]/confirmation/page.module.css, app/api/checkout/route.ts, lib/checkout.ts, components/CheckoutForm.tsx, components/CheckoutForm.module.css, lib/__tests__/checkout.test.ts, app/api/checkout/__tests__/checkout.test.ts_
    - _Verify: npm test -- checkout_
    - _Verify: npx tsc --noEmit_
    - _Area: api_

- [ ] 7. Orders
  - [ ] 7.1 Orders
    - Build the orders page at `/orders` (the shopper's orders newest first with order number, placed date, total, payment status and order status; "You have no orders yet" with a link to the listings) and the order detail page at `/orders/[id]` (lines with quantities and prices, total, delivery address, status pill; "Order not found" for another shopper's order), a list of cards on a phone and a table on a desktop, with `GET /api/orders` and `GET /api/orders/[id]`, and their own styles.
    - _Requirements: 6.1, 6.2, 6.3, 6.4_
    - _Depends: 1, 3, 6_
    - _Files: app/orders/page.tsx, app/orders/page.module.css, app/orders/[id]/page.tsx, app/orders/[id]/page.module.css, app/api/orders/route.ts, app/api/orders/[id]/route.ts, lib/orders.ts, components/OrderStatusPill.tsx, components/OrderStatusPill.module.css, lib/__tests__/orders.test.ts, app/api/orders/__tests__/orders.test.ts_
    - _Verify: npm test -- orders_
    - _Verify: npx tsc --noEmit_
    - _Area: api_

- [ ] 8. Admin dashboard
  - [ ] 8.1 Admin dashboard
    - Build the admin dashboard at `/admin` (orders placed today, revenue of today, active products, products with stock of 5 or fewer; four figure cards stacked on a phone with a menu of the admin pages, a left sidebar and a row of four figure cards on a desktop) and the admin layout with the sidebar, with `GET /api/admin/summary` and its own styles.
    - _Requirements: 7.1_
    - _Depends: 1, 3_
    - _Files: app/admin/layout.tsx, app/admin/layout.module.css, app/admin/page.tsx, app/admin/page.module.css, app/api/admin/summary/route.ts, lib/admin.ts, components/AdminSidebar.tsx, components/AdminSidebar.module.css, lib/__tests__/admin.test.ts, app/api/admin/__tests__/summary.test.ts_
    - _Verify: npm test -- summary_
    - _Verify: npx tsc --noEmit_
    - _Area: ui_

- [ ] 9. Admin products
  - [ ] 9.1 Admin products
    - Build the admin products page at `/admin/products` (every product with name, category, price, stock and status; a search field filtering by name; the product form in a panel on the right on a desktop and full screen on a phone; create as draft, edit, status control, delete that hides a product in a cart or an order with the message "This product is in a cart or an order, so it was hidden instead of deleted"; a table on a desktop and cards on a phone), with `GET`, `POST`, `PATCH` and `DELETE /api/admin/products`, the audit log entry for each change, and its own styles.
    - _Requirements: 7.2, 7.3, 7.4, 7.5, 7.6, 8.6_
    - _Depends: 1, 3, 8_
    - _Files: app/admin/products/page.tsx, app/admin/products/page.module.css, app/api/admin/products/route.ts, app/api/admin/products/[id]/route.ts, lib/adminProducts.ts, components/ProductForm.tsx, components/ProductForm.module.css, lib/__tests__/adminProducts.test.ts, app/api/admin/products/__tests__/adminProducts.test.ts_
    - _Verify: npm test -- adminProducts_
    - _Verify: npx tsc --noEmit_
    - _Area: api_

- [ ] 10. Admin orders
  - [ ] 10.1 Admin orders
    - Build the admin orders page at `/admin/orders` (every order newest first with order number, shopper name, placed date, total and status; a filter by status; a status control for shipped, delivered, cancelled and refunded; a table on a desktop and cards on a phone), with `GET /api/admin/orders` and `PATCH /api/admin/orders/[id]`, the audit log entry for each change, and its own styles.
    - _Requirements: 7.7, 7.8, 8.6_
    - _Depends: 1, 3, 8_
    - _Files: app/admin/orders/page.tsx, app/admin/orders/page.module.css, app/api/admin/orders/route.ts, app/api/admin/orders/[id]/route.ts, lib/adminOrders.ts, components/OrderStatusControl.tsx, components/OrderStatusControl.module.css, lib/__tests__/adminOrders.test.ts, app/api/admin/orders/__tests__/adminOrders.test.ts_
    - _Verify: npm test -- adminOrders_
    - _Verify: npx tsc --noEmit_
    - _Area: api_

- [ ] 11. Admin shoppers
  - [ ] 11.1 Admin shoppers
    - Build the admin shoppers page at `/admin/shoppers` (every Shopper account with name, email, registration date and number of orders; a table on a desktop and cards on a phone), with `GET /api/admin/shoppers` and its own styles.
    - _Requirements: 7.9_
    - _Depends: 1, 3, 8_
    - _Files: app/admin/shoppers/page.tsx, app/admin/shoppers/page.module.css, app/api/admin/shoppers/route.ts, lib/adminShoppers.ts, lib/__tests__/adminShoppers.test.ts, app/api/admin/shoppers/__tests__/adminShoppers.test.ts_
    - _Verify: npm test -- adminShoppers_
    - _Verify: npx tsc --noEmit_
    - _Area: api_

- [ ] 12. Admin reports
  - [ ] 12.1 Admin reports
    - Build the admin reports page at `/admin/reports` (the sales report as a table of the last 30 days with orders and revenue and a small bar chart of daily revenue; the stock report as a table of every product with stock of 5 or fewer; stacked on a phone), with `GET /api/admin/reports` and its own styles.
    - _Requirements: 7.10_
    - _Depends: 1, 3, 8_
    - _Files: app/admin/reports/page.tsx, app/admin/reports/page.module.css, app/api/admin/reports/route.ts, lib/reports.ts, components/RevenueChart.tsx, components/RevenueChart.module.css, lib/__tests__/reports.test.ts, app/api/admin/reports/__tests__/reports.test.ts_
    - _Verify: npm test -- reports_
    - _Verify: npx tsc --noEmit_
    - _Area: api_

- [ ] 13. Store quality
  - [ ] 13.1 Store quality
    - Add the load check for 200 concurrent listings and search requests against a server the test starts itself on a port it picks (8.1), the accessibility pass over the store pages (a label on every control, alternative text on every image, a visible focus outline, 8.7), and the health path test that starts the server, calls `/api/health` and stops it (8.4).
    - _Requirements: 8.1, 8.4, 8.7_
    - _Depends: 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12_
    - _Files: tests/load.test.ts, tests/accessibility.test.ts, tests/health.test.ts, tests/helpers/server.ts_
    - _Verify: npm test -- load_
    - _Verify: npm test -- accessibility_
    - _Verify: npm test -- health_
    - _Area: api_

- [ ] 14. Deployment setup
  - [ ] 14.1 Deployment setup
    - Write the `Dockerfile` (multi-stage build of the Next.js app, Prisma client generated, migrations applied at start), `.dockerignore`, `docker-compose.prod.yml` (app image `online-shopping-app:${APP_TAG}` with the SQLite file on a named volume, a Caddy service for HTTPS when a domain is given, a start command that runs `prisma migrate deploy`, then creates the first Admin from `FIRST_ADMIN_EMAIL` and `FIRST_ADMIN_PASSWORD` when both are set and no account exists, and never runs the seed script) and a short deploy note in `README.md`; secrets are read from environment variables only.
    - _Requirements: 8.4, 8.5_
    - _Depends: 1_
    - _Files: Dockerfile, .dockerignore, docker-compose.prod.yml, README.md_
    - _Verify: docker compose -f docker-compose.prod.yml config --quiet --no-interpolate_
    - _Verify: docker build -t online-shopping-app:verify ._
    - _Mode: devops_
    - _Area: deploy_

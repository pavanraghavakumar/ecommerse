# Requirements brief — Online Shopping App
## Profile
An Amazon-like online store where shoppers browse products, search and filter, keep a cart and wishlist, check out, and sign in, while admins manage the catalog and orders. · web app · e-commerce · size: business · depth: standard · money, personalData, publicUsers
- **Has a user interface?** Yes (The description asks for a modern responsive UI with product listings, cart and checkout screens.)
- **Runs locally?** Yes (It is a web app serving pages and an API, so Greenfield can start it locally with SQLite.)
## The app
An Amazon-like online store where shoppers browse, search and filter products, keep a cart and wishlist, sign in and check out by card, while store staff manage products and orders in an admin dashboard. It runs on a SQLite database with a modern responsive interface.
## Goals and success
- G1 Build a complete Amazon-like shopping application. (description)
- M1 100 completed orders within 3 months of launch (100 orders by 3 months after launch) [assumed] (Q5)
- M2 At least 20% of shoppers place a second order within 6 months (20% repeat buyers by 6 months after launch) [assumed] (Q5)
## Roles
- R1 Shopper (description)
- R2 Admin — Store staff (description, Q2)
## Permissions
- R1 Shopper may browse and search products, manage their own cart and wishlist, place an order and pay, see their own orders only (description, Q3, assumption)
- R2 Store staff may add, edit and hide products, see and update all orders, see shopper accounts and order history (Q2, assumption)
## Workflows
### W1 Browse and search products (release 1) — actors: R1 Shopper; trigger: A shopper opens the store; outcome: The shopper finds a product (description)
1. The shopper opens the product listings
2. The shopper searches or filters
3. The shopper opens a product
- X3 A search returns no products. [assumed] (assumption)
### W2 Add to cart and check out (release 1) — actors: R1 Shopper; trigger: A shopper wants to buy; outcome: An order is placed (description, Q1)
1. The shopper adds a product to the cart
2. The shopper signs in
3. The shopper checks out and pays by card through a payment provider
4. The order is placed
- X1 A card payment is declined at checkout. [assumed] (assumption)
- X2 A product goes out of stock while it is in a cart. [assumed] (assumption)
### W3 Manage the store (release 1) — actors: R2 Store staff; trigger: An admin opens the dashboard; outcome: The store is up to date (description)
1. The admin opens the admin dashboard
2. The admin manages products and orders
- X4 An admin deletes a product that is in open carts or orders. [assumed] (assumption)
## Records
- E1 Product. fields: name, description, price, stock, category, image, status; states: draft → active → hidden; owner: R2; how many: about 500 at launch, about 5,000 by year 3 (description, assumption)
- E2 Cart. fields: shopper, product lines, quantities, updated at; states: open → checked out → abandoned; owner: R1; how many: one open cart per shopper (description, assumption)
- E3 Wishlist. fields: shopper, products, added at; states: saved → removed; owner: R1; how many: a few per shopper (description, assumption, Q4)
- E4 Order. fields: order number, shopper, lines, total, payment status, delivery address, placed at; states: placed → paid → shipped → delivered → cancelled → refunded; owner: R1; how many: about 100 in the first 3 months (description, assumption)
- E5 User account. fields: name, email, password, addresses, role; states: registered → active → closed; owner: R1; how many: grows with orders (description, assumption, Q3)
## Rules
- BR1 A shopper must sign in to buy.. Applies: A shopper who is not signed in is asked to sign in before checking out.. Does not apply: A shopper who is signed in checks out without signing in again. (Q3)
- BR2 A product can only be sold while it is active and in stock.. Applies: An active product with stock can be added to a cart and bought.. Does not apply: A hidden product cannot be added to a cart. [assumed] (assumption)
- BR3 An order is only placed once the payment provider confirms the card payment.. Applies: A confirmed payment moves the order to paid.. Does not apply: A declined payment leaves the order unplaced. (assumption, Q1)
## Quality targets
- N1 [scale] The store handles 200 shoppers at the busiest moment, with peaks on evenings and weekends.: 200 shoppers at the busiest moment [assumed] (assumption)
- N2 [performance] Product pages and search results load in under 2 seconds.: 2 seconds [assumed] (assumption)
- N3 [performance] Checkout completes in under 3 seconds after payment confirmation.: 3 seconds [assumed] (assumption)
- N4 [availability] The store is available 99.5% of the month, with maintenance in low-traffic hours.: 99.5% uptime per month [assumed] (assumption)
## Integrations
- I1 Card payments go through a payment provider; the app sends the amount and receives the payment result, fresh at checkout, and holds the order unplaced if the provider is down. (assumption, Q1)
## Reports
- RP1 Sales report: orders and revenue by day, read by store staff, fresh to the last hour. [assumed] (assumption)
- RP2 Stock report: products low or out of stock, read by store staff, fresh to the last hour. [assumed] (assumption)
## Scope and constraints
- S1 Product listings, search, filters, cart, wishlist, checkout, sign-in and admin dashboard. (description)
- S2 The app uses a SQLite database. [constraint] (description)
## Decisions
- **Stack:** Next.js, Node.js and SQLite (decided by Greenfield; suggested: It gives a modern responsive storefront and admin in one codebase, with SQLite as the description asks.) (Q6)
- **Deploy target:** A cloud app host with a managed disk for SQLite (decided by Greenfield; suggested: It keeps SQLite on a persistent disk and scales for a new public store.) (Q7)
## Assumptions
- A1 The store starts with about 500 products and grows to about 5,000 by year 3. — No catalog size was given; a small-to-mid catalog fits a new store. [assumed] (assumption)
- A2 There are 2 to 5 store staff (admins) running the dashboard. — The description names store staff but no head count. [assumed] (assumption, Q2)
- A3 Shoppers are consumers in one country, browsing on desktop and phone. — An Amazon-like store serves the public; no country or device was named. [assumed] (assumption)
- A4 The store is new: there is no existing catalog, customer list or order history to move in. — Nothing in the description mentions an existing store or data. [assumed] (assumption)
- A5 Today orders would be taken by message or spreadsheet, with no online catalog; the app replaces that. — No current way of selling was described. [assumed] (assumption)
- A6 The closest products are Amazon and Shopify storefronts; copy their search, filters and one-page checkout, avoid their cluttered product pages. — The description names Amazon as the model. [assumed] (assumption, description)
- A7 The app must respond to: a shopper placing an order, a payment succeeding or failing, an admin changing a product, and a cart left for more than 30 days. — These are the events the described features imply. [assumed] (assumption)
- A8 Each main workflow runs many times a day at peak; browsing is the most frequent. — No frequency was given for the workflows. [assumed] (assumption)
- A9 An hour of outage costs lost sales and shopper trust; no more than 15 minutes of order data may be lost. — An online store loses money while down.; high impact [assumed] (assumption)
- A10 Shoppers sign in with email and password; admins use the same sign-in with an admin role. — Sign-in is required to buy; no company login was named.; high impact [assumed] (assumption, Q3)
- A11 The worst misuse is someone taking over a shopper account or an admin account; shoppers must never see other shoppers' data. — Accounts hold addresses and order history.; high impact [assumed] (assumption)
- A12 The store keeps shopper name, email, address and order history; users are in one country; data is kept while the account is open and deleted on request. — An online store holds personal data; no country or retention was named.; high impact [assumed] (assumption)
- A13 Every order and product change is logged with who did it and when, kept for 2 years. — Orders and payments need to be provable. [assumed] (assumption)
- A14 The store meets WCAG 2.2 AA, is in English, and shows prices in one currency. — A public store should be accessible; no language or currency was named. [assumed] (assumption)
- A15 Shoppers use desktop and phone; the store works online only. — No offline need was described. [assumed] (assumption)
- A16 The owner is alerted when the store is down or payments fail; support can look at a shopper's orders. — No support arrangement was described. [assumed] (assumption)
- A17 The likeliest failures are payment provider outages, stock errors and account takeovers. — These are the main risks of an online store. [assumed] (assumption)
- A18 The store is working when it reaches 100 completed orders within 3 months of launch, with at least 20% of shoppers returning to buy again. — A new store needs a clear early signal of both volume and shopper satisfaction. [assumed] (assumption, Q5)
## Other facts
- F2 The UI must be modern and responsive. [look] (description)
- F3 Shoppers pay by card through a payment provider at checkout. [money] (Q1)
- F4 Store staff add and edit products in an admin dashboard. [stakeholders] (Q2)
- F5 The wishlist saves products for a shopper to look at later. [workflows] (Q4)
- F6 Store staff can change product details, prices, stock and order status without a developer. [admin] (assumption, Q2)
## The interview
- Q1 [money · owner] When a shopper checks out, how do they pay? → Card payment through a provider
- Q2 [stakeholders · owner] Who adds and edits the products? → Store staff in an admin dashboard
- Q3 [permissions · owner] Must shoppers create an account to buy? → Yes, sign-in is required
- Q4 [workflows · owner] What does the wishlist do for a shopper? → Saves products to look at later
- Q5 [success · owner] When the store has been running for a while, what would tell you it is working well? → Decide for me (settled: The store is working when it reaches 100 completed orders within 3 months of launch, with at least 20% of shoppers returning to buy again.)
## Decided by Greenfield (Enough, decide the rest)
- Q6 Which stack should the store be built with? → Decide for me (settled: Next.js, Node.js and SQLite)
- Q7 Where should the store be deployed? → Decide for me (settled: A cloud app host with a managed disk for SQLite)

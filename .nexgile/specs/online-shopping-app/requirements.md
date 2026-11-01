# Requirements: Online Shopping App

An Amazon-like online store where shoppers browse products, search and filter, keep a cart and wishlist, sign in and check out by card, while store staff manage products and orders in an admin dashboard. It runs on a SQLite database with a modern responsive interface.

The store opens at `/` on the product listings, which anyone may see. A shopper who signs in lands on the product listings; an admin who signs in lands on the admin dashboard.

## Requirement 1: Browse and search products

**User Story:** As a Shopper, I want to browse, search and filter the product listings and open a product, so that I find the product I want to buy.

_Source: W1, S1, N2, A6_

### Acceptance Criteria

1. WHEN a visitor opens `/` THE SYSTEM SHALL show the product listings of every active product with stock above zero, each with its image, name, price and category, 24 products per page.
2. WHEN the shopper types a search term and submits it THE SYSTEM SHALL show only the active products whose name or description contains that term, ignoring letter case, and show the number of products found.
3. IF the search term matches no active product THEN THE SYSTEM SHALL show the message "No products found" with a link back to the full listings.
4. WHEN the shopper picks a category, a minimum price, a maximum price or a sort order THE SYSTEM SHALL show only the products that match every filter picked, sorted by price low to high, price high to low, or newest first.
5. WHEN the shopper clicks a product card THE SYSTEM SHALL open the product page with the product's image, name, price, description, category, stock status and an Add to cart button.
6. IF the product page is opened for a product that is hidden or has no stock THEN THE SYSTEM SHALL show the message "This product is not available" and no Add to cart button.
7. WHEN the shopper opens the product listings or a product page THE SYSTEM SHALL show the page within 2 seconds.
8. WHEN the shopper opens the product listings on a phone THE SYSTEM SHALL show the filters in a panel that opens from a Filters button, and on a desktop THE SYSTEM SHALL show the filters in a column beside the listings.

## Requirement 2: Sign in and register

**User Story:** As a Shopper, I want to register and sign in with my email and password, so that I can buy and see my own orders.

_Source: R1, E5, BR1, A10, A11_

### Acceptance Criteria

1. WHEN a visitor submits the registration form with a name, an email, a password of at least 8 characters and a delivery address THE SYSTEM SHALL create an account with the role Shopper and sign the person in.
2. IF the email submitted at registration already belongs to an account THEN THE SYSTEM SHALL show the message "An account with this email already exists" and create no account.
3. WHEN a person submits a registered email and the matching password THE SYSTEM SHALL sign them in and open the product listings, or the admin dashboard when the account has the role Admin.
4. IF the email or password submitted at sign-in is wrong THEN THE SYSTEM SHALL show the message "Email or password is incorrect" and sign no one in.
5. WHILE a person is signed in THE SYSTEM SHALL show their name in the header with links to their cart, wishlist and orders, and a Sign out link.
6. WHEN a person clicks Sign out THE SYSTEM SHALL end their session and show the product listings.
7. IF a person who is not signed in opens the cart, wishlist, checkout or orders page THEN THE SYSTEM SHALL show the sign-in page and return them to that page after they sign in.
8. IF a signed-in Shopper opens the admin dashboard THEN THE SYSTEM SHALL show the message "You do not have access to this page".

## Requirement 3: Cart

**User Story:** As a Shopper, I want to keep a cart of the products I mean to buy, so that I can check out in one go.

_Source: W2, E2, BR2, X2_

### Acceptance Criteria

1. WHEN the shopper clicks Add to cart on a product page THE SYSTEM SHALL add one unit of that product to their open cart and show the message "Added to cart".
2. WHEN the shopper clicks Add to cart for a product already in their cart THE SYSTEM SHALL increase that product's quantity by one, up to the product's stock.
3. WHEN the shopper opens the cart THE SYSTEM SHALL show each product line with its image, name, unit price, quantity, line total and a Remove button, and the cart total.
4. WHEN the shopper changes a quantity or clicks Remove THE SYSTEM SHALL update the cart and the cart total at once.
5. IF the shopper sets a quantity above the product's stock THEN THE SYSTEM SHALL set it to the stock and show the message "Only N left in stock", where N is the stock.
6. IF a product in the cart is hidden or has no stock at checkout THEN THE SYSTEM SHALL mark that line "No longer available", leave it out of the cart total and block checkout until the shopper removes it.
7. WHEN the shopper clicks Add to cart on a hidden product THE SYSTEM SHALL show the message "This product is not available" and add nothing.
8. WHEN a shopper who is not signed in clicks Add to cart THE SYSTEM SHALL keep the product in a cart in the browser and move it into their cart when they sign in.

## Requirement 4: Wishlist

**User Story:** As a Shopper, I want to save products to a wishlist, so that I can look at them later.

_Source: E3, F5_

### Acceptance Criteria

1. WHEN the shopper clicks the heart on a product card or product page THE SYSTEM SHALL add that product to their wishlist and fill the heart.
2. WHEN the shopper clicks a filled heart THE SYSTEM SHALL remove that product from their wishlist and empty the heart.
3. WHEN the shopper opens the wishlist THE SYSTEM SHALL show each saved product with its image, name, price, an Add to cart button and a Remove button, newest first.
4. IF the wishlist has no products THEN THE SYSTEM SHALL show the message "Your wishlist is empty" with a link to the product listings.
5. WHEN the shopper clicks Add to cart on a wishlist product THE SYSTEM SHALL add it to the cart and keep it in the wishlist.

## Requirement 5: Checkout and card payment

**User Story:** As a Shopper, I want to check out and pay by card, so that my order is placed.

_Source: W2, E4, BR1, BR3, I1, X1, N3, F3_

### Acceptance Criteria

1. WHEN a signed-in shopper with a cart clicks Checkout THE SYSTEM SHALL show the checkout page with the delivery address, the order lines, the order total and the card payment form.
2. WHEN the shopper submits the checkout form with a delivery address and card details THE SYSTEM SHALL send the order total to the payment provider and wait for its result.
3. WHEN the payment provider confirms the payment THE SYSTEM SHALL place the order with the status paid, empty the cart, reduce each product's stock by the quantity bought and show the order confirmation page with the order number and total.
4. IF the payment provider declines the payment THEN THE SYSTEM SHALL show the message "Your payment was declined. Your order was not placed." and keep the cart as it was.
5. IF the payment provider does not answer within 30 seconds THEN THE SYSTEM SHALL show the message "We could not confirm your payment. Your order was not placed." and keep the cart as it was.
6. WHEN the payment is confirmed THE SYSTEM SHALL show the order confirmation page within 3 seconds.
7. WHEN the shopper clicks Checkout while signed out THE SYSTEM SHALL show the sign-in page and open the checkout page after sign-in.
8. IF the cart is empty THEN THE SYSTEM SHALL show the message "Your cart is empty" and no checkout form.

## Requirement 6: Orders

**User Story:** As a Shopper, I want to see my own orders, so that I know what I bought and where it is.

_Source: E4, R1, A11_

### Acceptance Criteria

1. WHEN the shopper opens the orders page THE SYSTEM SHALL show their orders newest first, each with its order number, placed date, total, payment status and order status.
2. WHEN the shopper clicks an order THE SYSTEM SHALL show its lines with quantities and prices, its total, its delivery address and its status.
3. IF the shopper opens the address of an order that belongs to another shopper THEN THE SYSTEM SHALL show the message "Order not found".
4. IF the shopper has no orders THEN THE SYSTEM SHALL show the message "You have no orders yet" with a link to the product listings.

## Requirement 7: Admin dashboard

**User Story:** As an Admin, I want to manage products and orders in an admin dashboard, so that the store is up to date.

_Source: W3, R2, E1, F4, F6, X4, RP1, RP2_

### Acceptance Criteria

1. WHEN an Admin signs in THE SYSTEM SHALL open the admin dashboard with the number of orders placed today, the revenue of today, the number of active products and the number of products with stock of 5 or fewer.
2. WHEN the Admin opens the products list THE SYSTEM SHALL show every product with its name, category, price, stock and status, and a search field that filters the list by name.
3. WHEN the Admin submits the product form with a name, description, price, stock, category and image URL THE SYSTEM SHALL create the product with the status draft and show it in the products list.
4. WHEN the Admin edits a product and saves THE SYSTEM SHALL update its name, description, price, stock, category and image.
5. WHEN the Admin sets a product's status to active, hidden or draft THE SYSTEM SHALL save it, and a hidden product SHALL no longer appear in the product listings.
6. IF the Admin tries to delete a product that is in an open cart or in an order THEN THE SYSTEM SHALL hide the product instead and show the message "This product is in a cart or an order, so it was hidden instead of deleted".
7. WHEN the Admin opens the orders list THE SYSTEM SHALL show every order newest first with its order number, shopper name, placed date, total and status, and a filter by status.
8. WHEN the Admin changes an order's status to shipped, delivered, cancelled or refunded THE SYSTEM SHALL save it, and the shopper SHALL see the new status on their order.
9. WHEN the Admin opens the shoppers list THE SYSTEM SHALL show every Shopper account with their name, email, registration date and number of orders.
10. WHEN the Admin opens the sales report THE SYSTEM SHALL show the orders and revenue of each of the last 30 days, and the stock report SHALL list every product with stock of 5 or fewer.

## Requirement 8: Store quality

**User Story:** As the store owner, I want the store to stay fast, available and accessible, so that shoppers keep buying.

_Source: N1, N2, N3, N4, A13, A14, A16, A17_

### Acceptance Criteria

1. WHEN 200 shoppers use the store at the same moment THE SYSTEM SHALL answer every product listings request and every search request with a success status.
2. WHEN a shopper opens a product page or a search result THE SYSTEM SHALL show it within 2 seconds.
3. WHEN the payment provider confirms a payment THE SYSTEM SHALL show the order confirmation within 3 seconds.
4. WHEN the store is running THE SYSTEM SHALL answer its health path with a success status, so that the owner is alerted when it does not.
5. WHEN a shopper opens any page of the store THE SYSTEM SHALL answer with a success status for at least 99.5% of the requests of each calendar month, and the store SHALL be unavailable for no more than 3 hours and 36 minutes in that month.
6. WHEN an Admin changes a product or an order THE SYSTEM SHALL record who made the change and when, and keep the record for 2 years.
7. WHEN a shopper uses the store with a keyboard or a screen reader THE SYSTEM SHALL give every control a label and every image alternative text, and show a visible focus outline on every control.

## Later releases

- M1 100 completed orders within 3 months of launch — a launch goal, not a feature of release 1.
- M2 At least 20% of shoppers place a second order within 6 months — a launch goal, not a feature of release 1.

## Assumptions

- The store shows prices in US dollars, in English, for shoppers in one country.
- A shopper's delivery address is entered at registration and can be changed at checkout; the order keeps the address it was placed with.
- The card payment provider is a test-mode provider whose keys come from environment variables, so checkout can be tried locally without a live merchant account.
- A cart left for more than 30 days is abandoned and emptied.
- An order's status moves from paid to shipped to delivered, or from paid to cancelled or refunded; an Admin makes each change.
- The admin dashboard's sales report covers the last 30 days, and its stock report lists products with stock of 5 or fewer.
- The store has one currency and one language; no product variants (size, colour) are sold in release 1.

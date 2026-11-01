import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Northwind Store",
    template: "%s · Northwind Store",
  },
  description:
    "An online store: browse and search products, keep a cart and a wishlist, and check out by card.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

/** The store name shown in the header and the page titles. */
export const STORE_NAME = "Northwind Store";

function SearchIcon() {
  return (
    <svg
      className="site-header__icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="16.5" y1="16.5" x2="21" y2="21" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg
      className="site-header__icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
      <path d="M2 3h3l2.4 11.2a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.6L21 7H6" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg
      className="site-header__icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 20.5 4.6 13a4.8 4.8 0 0 1 0-6.8 4.8 4.8 0 0 1 6.8 0l.6.6.6-.6a4.8 4.8 0 0 1 6.8 0 4.8 4.8 0 0 1 0 6.8Z" />
    </svg>
  );
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="site-header__inner">
            <Link href="/" className="site-header__brand">
              {STORE_NAME}
            </Link>

            <form
              className="site-header__search"
              action="/"
              method="get"
              role="search"
            >
              <label htmlFor="site-search" className="visually-hidden">
                Search products
              </label>
              <input
                id="site-search"
                type="search"
                name="q"
                placeholder="Search products"
                autoComplete="off"
              />
              <button type="submit" className="button-secondary">
                <SearchIcon />
                <span className="visually-hidden">Search</span>
              </button>
            </form>

            <nav className="site-header__nav" aria-label="Account">
              <Link href="/cart" className="site-header__icon-link">
                <CartIcon />
                <span>Cart</span>
              </Link>
              <Link href="/wishlist" className="site-header__icon-link">
                <HeartIcon />
                <span>Wishlist</span>
              </Link>
              <Link href="/orders" className="site-header__icon-link">
                Orders
              </Link>
              <Link href="/signin" className="site-header__icon-link">
                Sign in
              </Link>
            </nav>
          </div>
        </header>

        <main>{children}</main>
      </body>
    </html>
  );
}

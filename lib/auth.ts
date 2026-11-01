import { prisma } from "./db";
import { readSession, type Role, type Session } from "./session";

/**
 * Session checks for pages and API route handlers.
 *
 * `getSession` returns the signed-in account, or `null`.
 * `requireShopper` and `requireAdmin` return the account or throw an
 * `AuthError` carrying the status the caller should answer with: `401` when
 * nobody is signed in, `403` when the role is wrong.
 */

export interface CurrentAccount {
  id: string;
  name: string;
  email: string;
  address: string;
  role: Role;
}

export class AuthError extends Error {
  readonly status: 401 | 403;

  constructor(status: 401 | 403, message: string) {
    super(message);
    this.name = "AuthError";
    this.status = status;
  }
}

function toCurrentAccount(account: {
  id: string;
  name: string;
  email: string;
  address: string;
  role: string;
}): CurrentAccount {
  return {
    id: account.id,
    name: account.name,
    email: account.email,
    address: account.address,
    role: account.role === "admin" ? "admin" : "shopper",
  };
}

/** The signed-in account, or `null` when nobody is signed in. */
export async function getSession(): Promise<CurrentAccount | null> {
  const session: Session | null = await readSession();
  if (!session) return null;

  const account = await prisma.account.findUnique({
    where: { id: session.accountId },
    select: { id: true, name: true, email: true, address: true, role: true },
  });
  if (!account) return null;

  return toCurrentAccount(account);
}

/** The signed-in account, or a `401` `AuthError`. */
export async function requireAccount(): Promise<CurrentAccount> {
  const account = await getSession();
  if (!account) throw new AuthError(401, "You must sign in");
  return account;
}

/** The signed-in Shopper or Admin, or a `401` `AuthError`. */
export async function requireShopper(): Promise<CurrentAccount> {
  return requireAccount();
}

/** The signed-in Admin, or a `401`/`403` `AuthError`. */
export async function requireAdmin(): Promise<CurrentAccount> {
  const account = await requireAccount();
  if (account.role !== "admin") {
    throw new AuthError(403, "You do not have access to this page");
  }
  return account;
}

/** Turns an `AuthError` into the JSON error answer a route handler returns. */
export function authErrorResponse(error: unknown): Response | null {
  if (error instanceof AuthError) {
    return Response.json({ error: error.message }, { status: error.status });
  }
  return null;
}

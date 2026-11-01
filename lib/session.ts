import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Sessions are signed, HTTP-only cookies holding the account id and role.
 * The payload is base64url JSON, the signature is an HMAC-SHA256 of the
 * payload with `SESSION_SECRET`, so a cookie cannot be forged or edited.
 */

export const SESSION_COOKIE = "session";

/** Seven days, in seconds. */
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export type Role = "shopper" | "admin";

export interface Session {
  accountId: string;
  role: Role;
}

interface SessionPayload extends Session {
  /** Issued at, in seconds since the epoch. */
  iat: number;
}

const DEV_SECRET = "dev-session-secret-change-me";

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (secret && secret.length > 0) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET must be set in production");
  }
  return DEV_SECRET;
}

function base64UrlEncode(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

function base64UrlDecode(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a, "utf8");
  const right = Buffer.from(b, "utf8");
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

function isRole(value: unknown): value is Role {
  return value === "shopper" || value === "admin";
}

/** Builds a signed session token for the account. */
export function createSessionToken(
  session: Session,
  now: number = Date.now(),
): string {
  const payload: SessionPayload = {
    accountId: session.accountId,
    role: session.role,
    iat: Math.floor(now / 1000),
  };
  const encoded = base64UrlEncode(JSON.stringify(payload));
  return `${encoded}.${sign(encoded)}`;
}

/**
 * Reads a session token and returns its session, or `null` when the token is
 * malformed, its signature does not match, or it has expired.
 */
export function verifySessionToken(
  token: string | undefined | null,
  now: number = Date.now(),
): Session | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [encoded, signature] = parts;
  if (!encoded || !signature) return null;
  if (!safeEqual(signature, sign(encoded))) return null;

  let payload: unknown;
  try {
    payload = JSON.parse(base64UrlDecode(encoded));
  } catch {
    return null;
  }
  if (typeof payload !== "object" || payload === null) return null;

  const candidate = payload as Partial<SessionPayload>;
  if (typeof candidate.accountId !== "string" || candidate.accountId === "") {
    return null;
  }
  if (!isRole(candidate.role)) return null;
  if (typeof candidate.iat !== "number") return null;

  const ageSeconds = Math.floor(now / 1000) - candidate.iat;
  if (ageSeconds > SESSION_MAX_AGE || ageSeconds < -60) return null;

  return { accountId: candidate.accountId, role: candidate.role };
}

/** The cookie options every session cookie is written with. */
export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  };
}

/** Reads the session from the request cookies, or `null` when signed out. */
export async function readSession(): Promise<Session | null> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

/** Signs the account in by writing the session cookie. */
export async function startSession(session: Session): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, createSessionToken(session), sessionCookieOptions());
}

/** Ends the session by clearing the session cookie. */
export async function endSession(): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, "", { ...sessionCookieOptions(), maxAge: 0 });
}

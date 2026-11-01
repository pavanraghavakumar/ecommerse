import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { setupTestDatabase, type TestDatabase } from "./testDb";

let db: TestDatabase;
let auth: typeof import("../auth");
let session: typeof import("../session");
let prisma: (typeof import("../db"))["prisma"];

const cookieJar = new Map<string, string>();

vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (name: string) =>
      cookieJar.has(name) ? { name, value: cookieJar.get(name)! } : undefined,
    set: (name: string, value: string) => {
      cookieJar.set(name, value);
    },
    delete: (name: string) => {
      cookieJar.delete(name);
    },
  }),
}));

beforeAll(async () => {
  db = setupTestDatabase();
  process.env.SESSION_SECRET = "test-session-secret";
  session = await import("../session");
  auth = await import("../auth");
  prisma = (await import("../db")).prisma;
});

afterAll(async () => {
  await prisma?.$disconnect();
  db?.cleanup();
});

async function createAccount(role: "shopper" | "admin", email: string) {
  return prisma.account.create({
    data: {
      name: role === "admin" ? "Admin Person" : "Shopper Person",
      email,
      passwordHash: "scrypt$salt$hash",
      address: "1 Test Street",
      role,
    },
  });
}

describe("auth", () => {
  it("returns null when nobody is signed in", async () => {
    cookieJar.clear();
    await expect(auth.getSession()).resolves.toBeNull();
  });

  it("returns the signed-in account", async () => {
    const account = await createAccount("shopper", "auth-shopper@test.local");
    cookieJar.clear();
    cookieJar.set(
      session.SESSION_COOKIE,
      session.createSessionToken({ accountId: account.id, role: "shopper" }),
    );
    const current = await auth.getSession();
    expect(current?.id).toBe(account.id);
    expect(current?.role).toBe("shopper");
  });

  it("returns null for a session whose account is gone", async () => {
    cookieJar.clear();
    cookieJar.set(
      session.SESSION_COOKIE,
      session.createSessionToken({ accountId: "missing", role: "shopper" }),
    );
    await expect(auth.getSession()).resolves.toBeNull();
  });

  it("requireShopper throws 401 when signed out", async () => {
    cookieJar.clear();
    await expect(auth.requireShopper()).rejects.toMatchObject({ status: 401 });
  });

  it("requireShopper accepts a shopper and an admin", async () => {
    const shopper = await createAccount("shopper", "auth-shopper2@test.local");
    cookieJar.clear();
    cookieJar.set(
      session.SESSION_COOKIE,
      session.createSessionToken({ accountId: shopper.id, role: "shopper" }),
    );
    await expect(auth.requireShopper()).resolves.toMatchObject({
      id: shopper.id,
    });

    const admin = await createAccount("admin", "auth-admin@test.local");
    cookieJar.set(
      session.SESSION_COOKIE,
      session.createSessionToken({ accountId: admin.id, role: "admin" }),
    );
    await expect(auth.requireShopper()).resolves.toMatchObject({
      id: admin.id,
    });
  });

  it("requireAdmin refuses a shopper with 403", async () => {
    const shopper = await createAccount("shopper", "auth-shopper3@test.local");
    cookieJar.clear();
    cookieJar.set(
      session.SESSION_COOKIE,
      session.createSessionToken({ accountId: shopper.id, role: "shopper" }),
    );
    await expect(auth.requireAdmin()).rejects.toMatchObject({ status: 403 });
  });

  it("requireAdmin accepts an admin", async () => {
    const admin = await createAccount("admin", "auth-admin2@test.local");
    cookieJar.clear();
    cookieJar.set(
      session.SESSION_COOKIE,
      session.createSessionToken({ accountId: admin.id, role: "admin" }),
    );
    await expect(auth.requireAdmin()).resolves.toMatchObject({ id: admin.id });
  });

  it("authErrorResponse turns an AuthError into JSON", async () => {
    const response = auth.authErrorResponse(new auth.AuthError(403, "nope"));
    expect(response?.status).toBe(403);
    await expect(response?.json()).resolves.toEqual({ error: "nope" });
    expect(auth.authErrorResponse(new Error("other"))).toBeNull();
  });
});

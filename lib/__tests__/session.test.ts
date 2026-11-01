import { describe, expect, it, beforeEach } from "vitest";
import {
  createSessionToken,
  verifySessionToken,
  SESSION_MAX_AGE,
} from "../session";

describe("session tokens", () => {
  beforeEach(() => {
    process.env.SESSION_SECRET = "test-session-secret";
  });

  it("round-trips the account id and role", () => {
    const token = createSessionToken({ accountId: "acc_1", role: "shopper" });
    expect(verifySessionToken(token)).toEqual({
      accountId: "acc_1",
      role: "shopper",
    });
  });

  it("keeps the admin role", () => {
    const token = createSessionToken({ accountId: "acc_2", role: "admin" });
    expect(verifySessionToken(token)?.role).toBe("admin");
  });

  it("rejects a missing token", () => {
    expect(verifySessionToken(undefined)).toBeNull();
    expect(verifySessionToken("")).toBeNull();
  });

  it("rejects a token whose payload was edited", () => {
    const token = createSessionToken({ accountId: "acc_1", role: "shopper" });
    const [payload, signature] = token.split(".");
    const forged = Buffer.from(
      JSON.stringify({
        accountId: "acc_1",
        role: "admin",
        iat: Math.floor(Date.now() / 1000),
      }),
    ).toString("base64url");
    expect(verifySessionToken(`${forged}.${signature}`)).toBeNull();
    expect(verifySessionToken(`${payload}.${signature}x`)).toBeNull();
  });

  it("rejects a token signed with another secret", () => {
    const token = createSessionToken({ accountId: "acc_1", role: "shopper" });
    process.env.SESSION_SECRET = "another-secret";
    expect(verifySessionToken(token)).toBeNull();
  });

  it("rejects an expired token", () => {
    const issued = Date.now() - (SESSION_MAX_AGE + 60) * 1000;
    const token = createSessionToken(
      { accountId: "acc_1", role: "shopper" },
      issued,
    );
    expect(verifySessionToken(token)).toBeNull();
  });

  it("rejects a malformed token", () => {
    expect(verifySessionToken("not-a-token")).toBeNull();
    expect(verifySessionToken("a.b.c")).toBeNull();
  });
});

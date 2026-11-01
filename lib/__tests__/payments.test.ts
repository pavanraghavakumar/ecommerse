import { describe, expect, it } from "vitest";
import { charge, PAYMENT_TIMEOUT_MS } from "../payments";

const card = { number: "4242 4242 4242 4241", expiry: "12/30", cvc: "123" };
const declinedCard = { number: "4000 0000 0000 0002", expiry: "12/30", cvc: "123" };

const keys = { providerKey: "test_key", providerSecret: "test_secret" };

describe("charge", () => {
  it("confirms a normal card", async () => {
    await expect(charge(1999, card, keys)).resolves.toBe("confirmed");
  });

  it("declines a card ending in 0002", async () => {
    await expect(charge(1999, declinedCard, keys)).resolves.toBe("declined");
  });

  it("is unavailable when the provider key is unavailable", async () => {
    await expect(
      charge(1999, card, { providerKey: "unavailable", providerSecret: "x" }),
    ).resolves.toBe("unavailable");
  });

  it("is unavailable when the provider keys are missing", async () => {
    await expect(
      charge(1999, card, { providerKey: "", providerSecret: "" }),
    ).resolves.toBe("unavailable");
  });

  it("is unavailable when the provider does not answer in time", async () => {
    // The provider answers after PROVIDER_ANSWER_MS; the call gives up sooner.
    await expect(charge(1999, card, { ...keys, timeoutMs: 1 })).resolves.toBe(
      "unavailable",
    );
  });

  it("is unavailable for an amount that is not a positive integer", async () => {
    await expect(charge(0, card, keys)).resolves.toBe("unavailable");
    await expect(charge(-5, card, keys)).resolves.toBe("unavailable");
    await expect(charge(10.5, card, keys)).resolves.toBe("unavailable");
  });

  it("is unavailable for a card without a number", async () => {
    await expect(
      charge(1999, { number: "", expiry: "12/30", cvc: "123" }, keys),
    ).resolves.toBe("unavailable");
  });

  it("waits 30 seconds by default", () => {
    expect(PAYMENT_TIMEOUT_MS).toBe(30_000);
  });
});

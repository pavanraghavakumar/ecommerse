/**
 * The payment provider wrapper, in test mode.
 *
 * `charge(amountCents, card)` sends the amount and the card to the provider
 * and answers `confirmed`, `declined` or `unavailable`. The call has a
 * 30-second timeout; a timeout or a provider error is `unavailable`.
 *
 * In tests and local runs the provider is simulated, so both failure paths
 * can be tried without the network:
 * - a card number ending in `0002` is declined;
 * - a provider key of `unavailable` makes the call fail.
 */

export type PaymentResult = "confirmed" | "declined" | "unavailable";

export interface Card {
  /** The card number, digits only or with spaces and dashes. */
  number: string;
  /** Expiry as `MM/YY` or `MM/YYYY`. */
  expiry: string;
  /** The security code. */
  cvc: string;
  /** The name printed on the card. */
  name?: string;
}

export interface ChargeOptions {
  /** How long to wait for the provider, in milliseconds. Defaults to 30 seconds. */
  timeoutMs?: number;
  /** The provider key; defaults to `PAYMENT_PROVIDER_KEY`. */
  providerKey?: string;
  /** The provider secret; defaults to `PAYMENT_PROVIDER_SECRET`. */
  providerSecret?: string;
}

/** The provider's answer time limit: 30 seconds (5.5). */
export const PAYMENT_TIMEOUT_MS = 30_000;

/** The card number whose payments the test provider declines. */
export const DECLINED_CARD_SUFFIX = "0002";

/** The provider key that makes the test provider fail. */
export const UNAVAILABLE_KEY = "unavailable";

function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

function isCardLike(card: Card | null | undefined): card is Card {
  return (
    !!card &&
    typeof card.number === "string" &&
    digitsOnly(card.number).length >= 4
  );
}

/**
 * Charges the card for `amountCents`.
 *
 * Never throws: every failure is reported as `unavailable`, so checkout can
 * keep the cart as it was (5.4, 5.5).
 */
export async function charge(
  amountCents: number,
  card: Card,
  options: ChargeOptions = {},
): Promise<PaymentResult> {
  const timeoutMs = options.timeoutMs ?? PAYMENT_TIMEOUT_MS;

  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<PaymentResult>((resolve) => {
    timer = setTimeout(() => resolve("unavailable"), timeoutMs);
  });

  const call = callProvider(amountCents, card, options).catch(
    (): PaymentResult => "unavailable",
  );

  try {
    return await Promise.race([call, timeout]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/**
 * The provider call the test-mode wrapper simulates. It answers after
 * `PROVIDER_ANSWER_MS`, so a call with a shorter timeout is `unavailable`.
 */
export const PROVIDER_ANSWER_MS = 250;

/** The simulated provider call, used by `charge` and by the timeout test. */
export async function callProvider(
  amountCents: number,
  card: Card,
  options: ChargeOptions = {},
): Promise<PaymentResult> {
  const providerKey = options.providerKey ?? process.env.PAYMENT_PROVIDER_KEY;
  const providerSecret =
    options.providerSecret ?? process.env.PAYMENT_PROVIDER_SECRET;

  if (!Number.isInteger(amountCents) || amountCents <= 0) {
    return "unavailable";
  }
  if (!isCardLike(card)) {
    return "unavailable";
  }
  if (providerKey === UNAVAILABLE_KEY) {
    throw new Error("Payment provider is unavailable");
  }
  if (!providerKey || !providerSecret) {
    throw new Error("Payment provider keys are not configured");
  }

  await new Promise((resolve) => setTimeout(resolve, PROVIDER_ANSWER_MS));

  if (digitsOnly(card.number).endsWith(DECLINED_CARD_SUFFIX)) {
    return "declined";
  }
  return "confirmed";
}

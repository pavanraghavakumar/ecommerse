import { test, expect } from "@playwright/test";

// 8.4: the store answers its health path with a success status, so the owner
// is alerted when it does not. This journey only reads, so it may run anywhere.
test("health path answers with a success status and ok", { tag: ["@smoke"] }, async ({ page }) => {
  const response = await page.goto("/api/health");
  expect(response?.status()).toBe(200);
  await expect(page.locator("body")).toContainText('"status":"ok"');
});

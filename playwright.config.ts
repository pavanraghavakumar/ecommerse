import { defineConfig } from "@playwright/test";

// The journeys in e2e/ run through run_journeys, which starts the app itself
// and passes its address as baseURL. Nothing here starts a server.
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: process.env.BASE_URL ?? "http://localhost:3000",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
});

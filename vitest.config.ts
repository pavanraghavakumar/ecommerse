import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: [
      "lib/**/*.test.{ts,tsx}",
      "app/**/*.test.{ts,tsx}",
      "components/**/*.test.{ts,tsx}",
      "tests/**/*.test.{ts,tsx}",
    ],
    // Playwright journeys live in e2e/ and run through run_journeys, never Vitest.
    exclude: ["node_modules/**", ".next/**", "e2e/**"],
    // Each test file gets its own SQLite database, so files may run side by side.
    pool: "forks",
    testTimeout: 30000,
    hookTimeout: 60000,
  },
});

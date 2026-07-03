import { defineConfig, devices } from "@playwright/test";

// E2E tests run against the dev server and live mainnet GraphQL — they assert
// structure and behavior, not exact chain values. Generous timeouts: every
// page does real network reads through the wasm SDK.
export default defineConfig({
  testDir: "./tests",
  timeout: 60_000,
  expect: { timeout: 20_000 },
  fullyParallel: true,
  retries: 1,
  workers: 4,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:5199",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run dev -- --port 5199",
    url: "http://localhost:5199",
    reuseExistingServer: true,
    timeout: 30_000,
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1320, height: 900 } } },
    { name: "mobile", use: { ...devices["iPhone 13"] } },
  ],
});

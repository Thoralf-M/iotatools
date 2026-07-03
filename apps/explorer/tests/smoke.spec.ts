// Every route renders against live mainnet without an app-level error.

import { expect, test } from "@playwright/test";
import { appReady, noErrorNote } from "./helpers";

const ROUTES: Array<[path: string, headingRe: RegExp]> = [
  ["/", /NETWORK PULSE/],
  ["/checkpoints", /CHECKPOINTS/],
  ["/transactions", /TRANSACTIONS/],
  ["/epochs", /EPOCHS/],
  ["/analytics", /ANALYTICS/],
  ["/events", /EVENTS/],
  ["/objects", /OBJECTS/],
  ["/packages", /MOVE PACKAGES/],
  ["/validators", /VALIDATORS/],
  ["/names", /IOTA.?NAMES/i],
  ["/graphql", /GRAPHQL CONSOLE/],
  ["/protocol", /PROTOCOL CONFIG/],
  ["/lab/decode", /BCS DECODER/],
  ["/lab/dryrun", /DRY RUN/i],
  ["/lab/keys", /KEYS & ADDRESSES/i],
];

for (const [path, headingRe] of ROUTES) {
  test(`route ${path} renders`, async ({ page }) => {
    await page.goto(path);
    await appReady(page);
    await expect(page.locator(".page-head h1")).toContainText(headingRe, { timeout: 45_000 });
    await noErrorNote(page);
  });
}

test("removed faucet route is gone", async ({ page }) => {
  await page.goto("/lab/faucet");
  await appReady(page);
  await expect(page.locator(".page-head h1")).toContainText("404");
});

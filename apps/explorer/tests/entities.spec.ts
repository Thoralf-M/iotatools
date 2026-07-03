// Entity pages against stable mainnet objects: clock, framework package,
// IOTA coin, a showcase address, and dynamically-discovered tx/checkpoint.

import { expect, test } from "@playwright/test";
import { appReady, KNOWN, noErrorNote, tableRows } from "./helpers";

test("clock object 0x6 shows decoded contents", async ({ page }) => {
  await page.goto(`/object/${KNOWN.clockObject}`);
  await appReady(page);
  await expect(page.locator(".page-head h1")).toContainText("OBJECT", { timeout: 45_000 });
  await expect(page.locator(".pill", { hasText: "clock::Clock" }).first()).toBeVisible();
  // contents tab decodes the Move struct via moveObjectContents
  await page.getByRole("button", { name: /contents/i }).click();
  await expect(page.locator(".json-tree").first()).toContainText("timestamp_ms");
});

test("framework package 0x2 module browser works", async ({ page }) => {
  await page.goto(`/package/${KNOWN.frameworkPackage}`);
  await appReady(page);
  await expect(page.locator(".page-head h1")).toContainText("MOVE PACKAGE", { timeout: 45_000 });
  // open the coin module and expect functions to render
  await page.locator(".nav-item", { hasText: /^coin/ }).first().click();
  await expect(page.locator(".cmd-card").first()).toBeVisible({ timeout: 30_000 });
  await expect(page.locator(".cmd-head b", { hasText: "total_supply" }).first()).toBeVisible();
});

test("IOTA coin page shows metadata and supply", async ({ page }) => {
  await page.goto(`/coin/${encodeURIComponent(KNOWN.iotaCoinType)}`);
  await appReady(page);
  await expect(page.locator(".page-head")).toContainText(/IOTA/, { timeout: 45_000 });
  await expect(page.locator(".pill", { hasText: /native gas token/i })).toBeVisible();
  await expect(page.locator(".stat .v").first()).not.toBeEmpty();
});

test("address page shows balance breakdown and portfolio", async ({ page }) => {
  await page.goto(`/address/${KNOWN.showcaseAddress}`);
  await appReady(page);
  await expect(page.locator(".stat", { hasText: "AVAILABLE" })).toBeVisible({ timeout: 45_000 });
  await expect(page.locator(".stat", { hasText: "STAKED" })).toBeVisible();
  await tableRows(page); // portfolio table has at least the IOTA row
});

test("validators table links to a validator profile", async ({ page }) => {
  await page.goto("/validators");
  await appReady(page);
  const rows = await tableRows(page, 10);
  await rows.first().click();
  await page.getByRole("link", { name: /full profile/i }).click();
  await expect(page).toHaveURL(/\/validator\/0x/);
  await expect(page.locator(".stat", { hasText: /VOTING POWER/i })).toBeVisible({ timeout: 45_000 });
});

test("latest checkpoint and one of its transactions resolve", async ({ page }) => {
  await page.goto("/checkpoints");
  await appReady(page);
  const rows = await tableRows(page, 1);
  await rows.first().locator("a").first().click();
  await expect(page.locator(".page-head h1")).toContainText("CHECKPOINT", { timeout: 45_000 });
  await noErrorNote(page);

  // open its transactions tab and follow the first digest
  await page.getByRole("button", { name: /transactions/i }).click();
  const txLink = page.locator("table.tbl tbody tr a").first();
  await expect(txLink).toBeVisible({ timeout: 30_000 });
  await txLink.click();
  await expect(page.locator(".page-head h1")).toContainText("TX", { timeout: 45_000 });
  // digest integrity badge re-derived in wasm
  await expect(page.locator(".pill", { hasText: /DIGEST VERIFIED IN WASM/i })).toBeVisible();
});

// Developer tools: search resolution, decoder, keys lab, graphql console,
// transaction filter auto-apply.

import { expect, test } from "@playwright/test";
import { appReady, KNOWN } from "./helpers";

test("search resolves a checkpoint number", async ({ page }) => {
  await page.goto("/");
  await appReady(page);
  const box = page.locator(".search input");
  await box.fill("42");
  await box.press("Enter");
  await expect(page).toHaveURL(/\/checkpoint\/42/, { timeout: 30_000 });
  await expect(page.locator(".page-head h1")).toContainText("CHECKPOINT 42", { timeout: 45_000 });
});

test("search resolves the clock object", async ({ page }) => {
  await page.goto("/");
  await appReady(page);
  const box = page.locator(".search input");
  await box.fill(KNOWN.clockObject);
  await box.press("Enter");
  await expect(page).toHaveURL(/\/object\/0x0+6/, { timeout: 30_000 });
});

test("decoder round-trips a live transaction", async ({ page }) => {
  await page.goto("/lab/decode");
  await appReady(page);
  await page.getByRole("button", { name: /load example/i }).click();
  // auto-decodes after the example is fetched
  await expect(page.locator(".pill", { hasText: /transaction/i }).first()).toBeVisible({ timeout: 45_000 });
  await expect(page.locator(".json-tree").first()).toBeVisible();
  await expect(page.locator(".hexdump").first()).toBeVisible();
});

test("keys lab derives addresses from a generated mnemonic", async ({ page }) => {
  await page.goto("/lab/keys");
  await appReady(page);
  await page.getByRole("button", { name: /generate/i }).first().click();
  // all three scheme cards derive an address link
  await expect(page.locator(".cmd-card a[href^='/address/0x']").first()).toBeVisible({ timeout: 30_000 });
  const links = page.locator(".cmd-card a[href^='/address/0x']");
  expect(await links.count()).toBeGreaterThanOrEqual(3);
});

test("graphql console runs a preset query", async ({ page }) => {
  await page.goto("/graphql");
  await appReady(page);
  await page.getByRole("button", { name: /^chain id$/i }).click();
  await page.getByRole("button", { name: /run/i }).click();
  await expect(page.locator(".json-tree").first()).toContainText("chainIdentifier", { timeout: 45_000 });
});

test("transaction filters auto-apply without a button", async ({ page }) => {
  await page.goto("/transactions");
  await appReady(page);
  await expect(page.locator("table.tbl tbody tr").first()).toBeVisible({ timeout: 45_000 });
  // there is no apply button anymore
  await expect(page.locator("main").getByRole("button", { name: /^apply$/i })).toHaveCount(0);
  await expect(page.locator("main")).toContainText(/filters apply as you type/i);
});

test("events page renders without crashing on timestamps", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto("/events");
  await appReady(page);
  await expect(page.locator("table.tbl tbody tr").first()).toBeVisible({ timeout: 45_000 });
  expect(errors.filter((e) => e.includes("Invalid time value"))).toHaveLength(0);
});

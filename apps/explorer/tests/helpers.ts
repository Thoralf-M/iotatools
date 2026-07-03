import { expect, type Page } from "@playwright/test";

/** Wait until the wasm SDK booted and the app shell rendered. */
export async function appReady(page: Page) {
  await expect(page.locator(".sidebar, .mobile-header, .brand").first()).toBeVisible({ timeout: 30_000 });
}

/** Wait for at least `n` rows in the first data table on the page. */
export async function tableRows(page: Page, min = 1) {
  const rows = page.locator("table.tbl tbody tr");
  await expect(rows.nth(min - 1)).toBeVisible({ timeout: 30_000 });
  return rows;
}

/** Assert no page-level error note is shown. */
export async function noErrorNote(page: Page) {
  await expect(page.locator(".error-note")).toHaveCount(0);
}

export const KNOWN = {
  // stable, always-present mainnet entities
  clockObject: "0x0000000000000000000000000000000000000000000000000000000000000006",
  frameworkPackage: "0x0000000000000000000000000000000000000000000000000000000000000002",
  iotaCoinType: "0x2::iota::IOTA",
  showcaseAddress: "0xffffc09a043b10e089c6c306a475a00357f044c37c254c3b4df69cfe26cd3fff",
};

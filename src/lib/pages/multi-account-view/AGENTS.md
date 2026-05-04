# multi-account-view — Architecture & maintenance guide

Aimed at AI agents (and humans) making changes here. Skim section 1 before
editing anything; sections 2–6 are reference material to consult on demand.

> **Keep this file current.** Whenever you make non-trivial changes to any
> file in this folder — new component, new derived state, new convention,
> new gotcha discovered — update the relevant section here in the same
> change. Section 2's file map and section 6's conventions are the most
> likely to drift; section 4's gotchas should grow as new ones are hit. If
> something gets removed (a component, a helper, a state field), remove the
> matching reference here too — outdated docs are worse than missing ones.

## 1. Mental model — read this first

This page is two views in one component tree:

1. **Default mode** — a multi-account dashboard for moving objects between
   accounts via drag-and-drop, then executing the resulting transfers.
2. **"Staking mode"** (toggle in the toolbar) — a read-only-ish view that
   filters everything to staking-related objects, surfaces APR / rewards /
   commission per validator, and lets the user switch validators.

Both modes share the same orchestrator (`MultiAccountView.svelte`). Switching
modes hides irrelevant UI; the underlying account/object state is always
synced from chain regardless of mode.

**Key hard-learned constraints** (don't undo these without thought):

- **DnD and stake-only filtering are mutually exclusive.** `dragHandleZone`
  takes a list of items; if you pass a *filtered* list, a drop replaces the
  full list with only the filtered+dropped subset → silently drops everything
  hidden. Staking mode therefore renders a non-DnD list. See `AccountCard`.
- **Timelocked stakes are intentionally excluded from optimization.** Per
  product decision: users should unlock first, then optimize. They still show
  up in account cards (for visibility) but get no metric badge, no Optimize
  button, and aren't included in the chart's basket.
- **Effective commission per IIP-8** = `max(declared commission, voting-power
  share)`. Always show the effective number when displaying commission.
  Helper in `validator-info.ts`. Mirrors the system-state-page committee table.
- **Days-to-breakeven uses the user's *minimum* APR, not the average.** A
  weighted-average baseline makes most rows show "—". Min is more actionable:
  "would moving my worst-yielding stake here pay off?"
- **The exchange rate already encodes commission.** APR computed from the
  cached exchange-rate deltas is *net* APR — do not multiply by `(1 −
  commission)` again.
- **APR vs APY both shown.** APR is the linear annualization shown in the
  table header; APY (compounded, via `aprToApy`) is the realized yield since
  the staking pool auto-compounds at every epoch. Always offer both — APR
  first/primary (familiar), APY as the muted secondary.
- **Window-resolution shifts back when the current epoch has no rate yet.**
  See `resolveWindow` in `staking-metrics.ts` — the in-progress epoch's
  exchange rate isn't computed yet, so we shift `fromEpoch` back by the
  resolution gap to keep the requested window length over *completed*
  epochs. Without this the 1-day APR is always 0 and longer windows are
  underestimated.

---

## 2. File map

| File | Lines | Role |
|---|---|---|
| `MultiAccountView.svelte` | ~620 | Orchestrator. Owns top-level $state, runs sync, executes transactions, threads price/currency down. Auto-fetches IOTA price on mount with a 1h cache. Render is mostly delegation. |
| `Toolbar.svelte` | ~190 | Sync button (spinner + pulse), add-external-account input, staking-mode toggle, execute-transfers button. |
| `BalanceSummary.svelte` | ~175 | Totals table + currency selector + "Fetch price" button. Owns the price-fetch UI; the state itself lives in MultiAccountView (`$bindable`). |
| `AccountCard.svelte` | ~245 | One per account. Header with copy/remove/collapse. Two render paths: DnD list (default) vs filtered list (staking mode). |
| `ObjectItem.svelte` | ~245 | Single owned-object row. `variant: 'standard' \| 'timelocked'`. In staking mode, standard rows get a metric badge + Optimize button. |
| `TransactionResults.svelte` | ~100 | Tabbed execution-result view, reused for transfers and switch transactions. |
| `StakingControls.svelte` | ~200 | Top-of-staking-section: timeframe dropdown with prev/next arrows (1d/7d/15d/30d/50d/90d/all), per-stake metric type radio (commission vs rewards %), loading indicator. **Position: sticky** so the timeframe stays accessible while scrolling. |
| `ValidatorComparisonTable.svelte` | ~525 | Sortable table: Validator / Status / Effective commission / Days to breakeven / Net APR + APY / Pool stake. "Your stake" badge shows amount + share-of-total + fiat. APY shown inline as muted secondary text. |
| `StakingTrendChart.svelte` | ~1700 | Two modes: **My stake projection** (default) plots realized + 2 stay lines (APR linear / APY compounded) + 2 switch lines (APR / APY) + APY-based difference series + breakeven marker, with merged metrics + Switch button; **All validators** plots per-epoch returns colored by validator. Stake chips grouped by validator, sorted by total IOTA, color-graded green→red by commission, selection signaled by blue border (commission tint preserved). Configurable projection horizon (auto / 30 / 60 / 90 / 180 / 365 / 730). Switch-target dropdown shows `APR / APY · breakeven`. |
| `multi-account-service.ts` | ~210 | Async data: `getObjectsForAccounts`, `computeAllStakingRewards`, `fetchCurrentPrice({ maxAgeMs })` with localStorage cache (key `iota-price-cache-v1`). Defines `ExtendedAccount` / `ExtendedObject`. |
| `balance-utils.ts` | ~145 | Pure functions: per-object/per-account balance reducers, `formatIotaCompact`, `fiatValue`, `formatIotaWithFiat`, `isStakeObject`. Types: `Currency`, `FiatPrice`. |
| `transfer-transactions.ts` | ~165 | DnD movements → transfer PTBs. `getMovements`, `prepareTransferTransactions` (one PTB per sender), `executeTransferTransactions`. |
| `staking-transactions.ts` | ~90 | PTB builders. `buildSwitchValidatorTransactionMulti` chains N withdraw → from_balance → add_stake triples for one sender (caller must `tx.setSender`); `buildSwitchValidatorTransaction` is the single-stake convenience wrapper. |
| `staking-metrics.ts` | ~365 | Math + cache resolution. `resolveWindow` (handles current-epoch-not-cached and pre-pool-existence cases), `poolNetAprOverWindow`, `poolReturnOverWindow`, `poolReturnSeries` (cumulative), `poolPerEpochReturnSeries`, `stakeRewardsInWindow`, `aprToApy`, `computeBreakevenDays`, `projectStayVsSwitch`, `timeFrameToEpochRange`. |
| `validator-info.ts` | ~60 | `fetchValidatorsForStaking()` → `getLatestIotaSystemState()` mapped to `ValidatorInfoFull[]`. `effectiveCommissionBps()` helper (IIP-8: `max(declared, votingPowerShare)`). |

---

## 3. State & data flow

### Top-level state (in `MultiAccountView.svelte`)

| Variable | Type | Owner of write |
|---|---|---|
| `extendedAccounts` | `ExtendedAccount[]` | `syncReset`, DnD handler, add/remove account |
| `transactionResults` | `any[]` | `executeTransfers`, `executeSwitch` |
| `syncing` / `syncInFlight` | $state + non-reactive flag | `syncReset` (re-entrancy guard) |
| `stakingMode` | bool | Toolbar toggle |
| `selectedTimeFrame`, `metricType` | StakingControls | Bound to children |
| `validators`, `currentEpoch` | from validator-info | `loadStakingData` (untracked) |
| `selectedCurrency`, `currentPrice` | bound to BalanceSummary | Auto-fetched once on mount with `maxAgeMs: 1h` (localStorage cache); manual refresh via Fetch Price button bypasses cache |
| `chartFocusStake` | `string \| null` | Set when user clicks Optimize on a stake card; chart consumes & clears via `$bindable` |

### Key derivations (also `MultiAccountView.svelte`)

- `userStakeByPool: Map<poolId, bigint>` — sum of user's principal per pool
- `userPoolIds: Set<poolId>` — derived from the map's keys
- `userStakeRefs: UserStakeRef[]` — flat list with resolved validator
- `aprByPool: Map<poolId, number>` — net APR per pool over the chosen window
- `bestCommitteeApr: number` — highest committee APR (used for "better
  alternative" highlighting in stake badges)
- `userMinNetApr: number` — lowest known APR among user's stakes (used by
  the comparison table for breakeven; ignores 0/missing-data pools)
- `stakingMetrics: Map<stakeId, StakingMetricInfo>` — per-stake badge data

### Currency / price flow

```
MultiAccountView ──$bindable──▶ BalanceSummary  (UI for fetching/selecting)
       │
       └────props────▶ ValidatorComparisonTable / OptimizePanel-merged-into-chart / AccountCard / ObjectItem
```

Auto-fetched once via untracked `$effect` on mount. Manual refresh via the
Fetch Price button in BalanceSummary.

### "Optimize" click → chart focus

```
ObjectItem  →  AccountCard.onOptimizeStake  →  MultiAccountView.openOptimize
                                                       ↓
                                             chartFocusStake = stakeId
                                                       ↓
                              <StakingTrendChart bind:focusStakeRequest={chartFocusStake} />
                                                       ↓ ($effect inside chart)
                  mode = 'my-stake'; selectedStakeIds = {stakeId}; details.open = true; scrollIntoView; clear request
```

### Switch transaction execution

```
StakingTrendChart "Switch N stakes in M transactions"
       ↓ onSwitch(stakes, newValidator)
MultiAccountView.executeSwitch
       ↓ groups by accountAddress
       ↓ per group: buildSwitchValidatorTransactionMulti(...) → tx.setSender(account) → executeTransaction(tx)
TransactionResults shows one tab per account
```

---

## 4. Reactivity gotchas (Svelte 5)

These cost real time to track down. If you see the same symptom, recognize
it.

### "Thousands of RPC calls on toggling staking mode"

Cause: an async function called *inside* a `$effect` writes to `$state` it
also reads — Svelte tracks reads through the function call, so writes
trigger re-runs, including the `finally`-block reset of an in-flight flag,
which makes the next run proceed and loop forever.

**Pattern:** wrap the work in `untrack(() => fn())` and use a
non-reactive in-flight guard:

```ts
let workInFlight = false;
$effect(() => {
    if (!enabled) return;
    void someTrigger;  // explicit dep
    untrack(() => { if (!workInFlight) doAsyncWork(); });
});
```

Used by both `loadStakingData` and `syncReset`.

### "Clicking None does nothing — selection re-fills immediately"

Auto-init effects must distinguish "fresh visit, never set" from "user
explicitly cleared". Use a non-reactive `let stakesInitialized = false`
flag set on first init; afterwards just *prune* invalid IDs rather than
re-filling. See `StakingTrendChart.svelte` selectedStakeIds effect.

### Stale tooltip after currency switch

Chart.js tooltip callbacks close over their construction-time variables.
If price/currency change after construction, the tooltip keeps the stale
fiat. Solution: include them in the rebuild `$effect`'s read set so the
chart is re-instantiated:

```ts
$effect(() => {
    void points; void breakevenDays;
    void currentPrice; void selectedCurrency;  // ← needed
    if (canvas) build();
});
```

### Tooltips clipped by table-wrapper overflow

`overflow: auto` on the wrapper clips absolutely-positioned children
extending past its box — including tooltips above sticky `<th>` cells.
Position tooltips *below* (`top: calc(100% + 6px)`), bump z-index above
the sticky header, and right-anchor (`right: 0`) for rightmost columns.

### "All time" APR was always 0%

The cache only has rates from the pool's first staking epoch onward. With
`fromEpoch=1`, `findClosestCachedRate` (looks at-or-before) returned null.
Fix: `findEarliestCachedRate` falls forward to the pool's first cached
entry, and `resolveWindow` annualizes over the *actual* span between
resolved start/end epochs (not the requested span).

### Current-epoch rate isn't cached → tiny windows return 0%

The current epoch is in progress, so its exchange rate hasn't been
computed yet. Looking up `toEpoch = currentEpoch` falls back to the most
recent completed epoch's rate. With a 1-day window, that meant both
endpoints resolved to the same rate → 0% APR; longer windows had a
correct numerator but were divided by an inflated denominator.

Fix: `resolveWindow` measures the gap between `toEpoch` and the actually-
resolved end epoch, then shifts `fromEpoch` back by the same gap so the
window length is preserved over completed epochs.

### "(none — only show stay)" target gets immediately overridden

Same class as the None button bug. The auto-pick effect saw
`switchTargetAddress === ''` and treated it as "needs picking". Fix: a
non-reactive `switchTargetTouched` flag set by every user-driven change
(prev/next buttons + onchange on the dropdown). Also clear + reset the
flag on `focusStakeRequest` so a fresh Optimize click gets a fresh
suggestion.

### Selected chip lost its commission tint when clicked

Original `.chip.selected` rule overrode `background` to blue, hiding the
green→red tint. Fix: `.chip.selected` only changes `border-color` and
adds a 1px `box-shadow` ring; the `--commission-tint` CSS custom property
shows through. Same approach for `.group-toggle.all` / `.partial`.

### Chart tooltip jumped between unrelated x values

Symptom: tooltip went `−2 days, −1 day, +6 days` (skipping today through
+5). Cause: Chart.js `interaction.mode: 'index'` groups tooltip items by
*array index*, not by x value. With variable-length datasets (Realized
covers past, Stay/Switch projections cover future, etc.) the same array
index points to wildly different x values across datasets — and the
title callback's `items[0].parsed.x` then reports a misleading offset.

Fix: use `mode: 'x'` for both `interaction` and `tooltip` so items are
grouped by **x value** instead. Always prefer `'x'` over `'index'` when
the chart has multi-length datasets.

---

## 5. Adding things — common change recipes

### Add a new column to ValidatorComparisonTable

1. Add the field to the `Row` interface.
2. Compute it in the `rows` derivation.
3. Add a sort key to the `SortKey` union and a case in the sort comparator
   (sort `null`s last regardless of direction; see breakeven case).
4. Add the `<th class="sortable …" onclick={(e) => toggleSort(KEY, e)}>`
   with optional tooltip.
5. Render the cell with right-alignment (`<td class="right">`) when
   numeric.

### Add a new chart series

1. Build the data array as `{ x, y }[]` in `buildValidatorsDatasets` or
   `buildMyStakeDatasets`.
2. Push a dataset with `borderColor`, `backgroundColor: 'transparent'`,
   `pointRadius: 0`, `fill: false`, `yAxisID: 'y'` (or 'yDiff' for the
   secondary axis).
3. If the series should be skipped from tooltips (e.g. annotation lines),
   add a custom flag like `isBreakeven: true` and update the `tooltip.filter`
   callback to exclude it.

### Add a new staking transaction type

1. Builder in `staking-transactions.ts`. Don't bake in the sender —
   require the caller to `tx.setSender(...)`.
2. In `MultiAccountView`, group selected stakes by `accountAddress` and
   build one PTB per group (transactions can only have one sender).
3. Execute via `executeTransaction(tx)` from
   `../../utils/transaction-execution`. Attach `sender` and `recipients`
   to the result for `TransactionResults` to display.

### Surface a new per-stake metric

1. Add a field to `StakingMetricInfo` in `ObjectItem.svelte`.
2. Compute it in `MultiAccountView`'s `stakingMetrics` derivation.
3. Render it in `ObjectItem`'s `metricLabel` (or in a new `staking-row`
   subsection for richer display).

### Make a new chart zoomable

Mirror what's in `StakingTrendChart.svelte`:

```ts
import zoomPlugin from 'chartjs-plugin-zoom';
Chart.register(zoomPlugin);
// in options.plugins:
zoom: {
    zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: 'xy' },
    pan: { enabled: true, mode: 'xy' },
},
// add a Reset button calling chart.resetZoom()
```

### Add a new staking-time-frame preset

1. Extend the union in `staking-metrics.ts` (`StakingTimeFrame`) and add an
   entry to both `STAKING_TIME_FRAME_LABELS` and `STAKING_TIME_FRAME_DAYS`.
   Order in `STAKING_TIME_FRAME_LABELS` is the order users walk through
   with the prev/next arrows in `StakingControls`.
2. No UI change needed — the dropdown is data-driven via
   `Object.entries(STAKING_TIME_FRAME_LABELS)`.

### Surface a new computed metric (APY-style)

If you're adding a derived rate (`X = f(apr)`):

1. Helper in `staking-metrics.ts` — pure function, well-commented.
2. Render in `ValidatorComparisonTable` as the muted secondary in the
   APR column (`<span class="apy-hint">…</span>`).
3. Render in `StakingTrendChart` metrics cards' sub-value line.
4. Optionally include in chart dataset labels (legend) and the
   switch-target dropdown options.

Keeps the surface consistent across the four places where rate values
appear.

### Add a new auto-init effect

Use a non-reactive `let xInitialized = false` flag, NOT a `$state` one.
The flag must not retrigger the effect when set, otherwise you get the
"None button does nothing" class of bug. Mirror the `stakesInitialized`
or `switchTargetTouched` pattern.

---

## 6. Cross-cutting conventions

- **Svelte 5 runes everywhere.** `$state`, `$derived`, `$effect`, `$props`
  with `$bindable()`. No `export let`.
- **Pure helpers in .ts files**, components import them. Anything that's
  testable without a DOM lives in `*-utils.ts` / `*-metrics.ts`.
- **Reactive props are object-identity sensitive.** `$derived` only re-runs
  when its read graph changes; if a parent reassigns an array (`x = [...x]`)
  child derivations re-run. Mutating in place doesn't propagate.
- **Component types** are exported via `<script lang="ts">` `export
  interface Foo`. Parents import them as `import type { Foo } from
  './Bar.svelte'`.
- **Number formatting.** Use `formatIotaCompact` (2 decimals + `_`
  separators) for amounts. `formatIotaWithFiat` appends "(≈ $X.XX)" when a
  price is loaded. `fiatValue` returns `''` when there's no price.
- **Effective commission per IIP-8.** Always use
  `effectiveCommissionBps(v)`, never `v.commissionBps`. Show the declared
  rate inline in parens when it differs.
- **Time frame → epoch range.** 1 epoch ≈ 1 day on mainnet
  (`EPOCHS_PER_YEAR = 365`). `timeFrameToEpochRange(timeFrame, currentEpoch)`
  returns `{ fromEpoch, toEpoch }`.
- **APR is annualized.** "Window return" is the raw fraction over the
  window; "Net APR" is annualized. Keep the distinction in any new metric.
- **Cache convention.** Exchange-rate cache stores rate at logical epoch E
  under key E+1 (the rate computed at end of E and applied from E+1
  onward). All reads through `getCachedRate(poolId, logicalEpoch)` /
  `findClosestCachedRate` / `findEarliestCachedRate` / `resolveRate` /
  `resolveWindow` hide this offset; don't dig into the cache directly.
- **Window resolution.** Use `resolveWindow(poolId, fromEpoch, toEpoch)`
  whenever you need both endpoints of an APR/return window. It handles the
  current-epoch-not-cached gap and the pre-pool-existence forward-fallback
  in one place; the resulting `start.epoch` / `end.epoch` are what
  annualization should divide by, not the requested span.
- **APR vs APY.** `aprToApy(apr)` for the compounded equivalent; default
  is 365 compounding periods/year (one per epoch). Surface both wherever
  you display APR — APR primary, APY as muted secondary.
- **Color-grading by commission.** Inline `style="--commission-tint: …"`
  set via `commissionTint(v)` (interpolates HSL hue 142 → 0 between the
  network's min and max effective commission). Class-based selected states
  use `border-color` + `box-shadow`, never `background`, so the tint
  shows through.
- **Sticky controls.** `StakingControls` is `position: sticky; top: 0;
  z-index: 30` with a solid background composite (so content underneath
  doesn't bleed through when it pins). When adding new sticky elements,
  give them lower z-index so they tuck under it.
- **Price caching.** `fetchCurrentPrice({ maxAgeMs: 60 * 60 * 1000 })` for
  auto-fetch paths; bare `fetchCurrentPrice()` for manual-refresh buttons.
  Cache lives in `localStorage['iota-price-cache-v1']`.

---

## 7. Testing & validation

- `pnpm run check` — svelte-check + tsc. Should be 0 errors / 0 warnings.
- `pnpm test` — Vitest. No tests yet for this folder (197 tests elsewhere
  in the repo); add them in `<file>.test.ts` next to the source.
- `pnpm build` — production bundle. Multi-account-view chunk is ~158 KB
  gzipped 34 KB; staking-rewards cache is the bulk.
- Manual smoke: Sync, toggle staking mode, click Optimize on a stake,
  inspect both chart modes, click prev/next on switch target, verify
  switch button label reflects unique sender accounts.

---

## 8. Out-of-scope / known limitations

- **Timelocked stakes** — visible but excluded from optimization (intentional).
- **Custom timeframe ranges** — only presets
  (1/7/15/30/50/90/all). The staking-rewards page has custom dates if
  needed; this page deliberately keeps the picker fast.
- **Historical commission** — not in cache; the chart plots net per-epoch
  return (which already factors in commission via the exchange rate)
  rather than commission directly. The comparison table shows current
  IIP-8 effective commission only.
- **Cross-account batching** — switch transactions are one PTB per sender.
  No way to atomically switch across accounts (impossible per-protocol).
  The button label reflects the actual transaction count.
- **CoinGecko free tier** — the IOTA price endpoint rate-limits aggressively.
  The 1h cache + manual-refresh-only-on-button design avoids hammering it.
- **Stake page** (`../stake/`) still exists and provides simulate /
  unstake-specific-amount that the merged view doesn't yet replicate.
  Consider fold-in once parity is reached.

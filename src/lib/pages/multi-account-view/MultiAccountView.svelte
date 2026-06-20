<script lang="ts">
    import { isValidIotaAddress } from '@iota/iota-sdk/utils';
    import { onMount, untrack } from 'svelte';
    import type { DndEvent } from 'svelte-dnd-action';
    import { get } from 'svelte/store';

    import { addAndRun } from '../../stores/transaction-tray';
    import {
        sharedMultiAccountCompactAmounts,
        sharedMultiAccountCurrency,
    } from '../../utils/local-storage-store';
    import { updatePageQueryParams, usePageQueryParams } from '../../utils/page-query-params';
    import { iota_accounts } from '../../utils/signer-data';
    import {
        fetchAllExchangeRates,
        setInitialExchangeRateCacheFromBinary,
    } from '../staking-rewards';
    // @ts-ignore - Vite ?raw import returns the file as a string
    import exchangeRateCacheBinary from '../staking-rewards/cache/exchange-rate-cache.bin?raw';
    import AccountCard from './AccountCard.svelte';
    import type { Currency, FiatPrice } from './balance-utils';
    import BalanceSummary from './BalanceSummary.svelte';
    import {
        computeAllStakingRewards,
        fetchCurrentPrice,
        getObjectsForAccounts,
        type ExtendedAccount,
    } from './multi-account-service';
    import type { StakingMetricInfo } from './ObjectItem.svelte';
    import {
        poolNetAprOverWindow,
        poolReturnOverWindow,
        stakeRewardsInWindow,
        timeFrameToEpochRange,
        type StakingTimeFrame,
    } from './staking-metrics';
    import {
        buildStakeTransaction,
        buildSwitchValidatorTransactionMulti,
    } from './staking-transactions';
    import StakingControls, { type StakingMetricType } from './StakingControls.svelte';
    import StakingTrendChart, { type UserStakeRef } from './StakingTrendChart.svelte';
    import Toolbar from './Toolbar.svelte';
    import { getMovements, prepareTransferTransactions } from './transfer-transactions';
    import {
        effectiveCommissionBps,
        fetchValidatorsForStaking,
        type ValidatorInfoFull,
    } from './validator-info';
    import ValidatorComparisonTable from './ValidatorComparisonTable.svelte';

    // ─── Core multi-account state ────────────────────────────────────────────
    let extendedAccounts: ExtendedAccount[] = $state([]);
    let syncError = $state('');
    let newAccountAddress = $state('');
    let newAccountError = $state('');
    let stakingMode = $state(false);
    let syncing = $state(false);
    let numTransfers = $derived(getMovements(extendedAccounts).size);

    // ─── Visibility state (toolbar-driven, not persisted) ────────────────────
    /** Per-card "Hide" — soft hide, restored via the toolbar's "Show hidden". */
    let hiddenAddresses = $state(new Set<string>());
    /** Per-chip override that *forces* an account visible even when the global
     *  rules (hideEmpty, typeFilter) would have hidden it. Set by clicking a
     *  dimmed chip in the strip; cleared by clicking it again. */
    let forceVisibleAddresses = $state(new Set<string>());
    /** Per-card "Solo" — when set, only this address renders. */
    let soloAddress = $state<string | null>(null);
    /** Toolbar toggle. "Empty" = no objects and no timelocked objects. */
    let hideEmpty = $state(true);
    /** Global, partial, case-insensitive substring filter on Move object type. */
    let typeFilter = $state('');

    let normalizedTypeFilter = $derived(typeFilter.trim().toLowerCase());

    // Toggling `hideEmpty` clears the per-chip force-show overrides so the
    // user can re-hide previously revealed empties by simply toggling the
    // checkbox off and back on. Without this, overrides set during the
    // first "on" period would survive the off→on cycle and stubbornly
    // keep empty accounts visible.
    $effect(() => {
        void hideEmpty;
        untrack(() => {
            if (forceVisibleAddresses.size > 0) {
                forceVisibleAddresses = new Set();
            }
        });
    });

    // ─── Query-param persistence for toolbar state ───────────────────────────
    // Read-on-mount so deep links / reloads restore the user's last view; the
    // $effect below writes back as the user toggles. The `urlInitialized`
    // gate prevents the initial mount from clobbering an existing URL state
    // before we've read it.
    const queryParamDefaults = {
        stakingMode: false,
        hideEmpty: true,
        typeFilter: '',
    };
    const pageParams = usePageQueryParams(queryParamDefaults);
    let urlInitialized = false;

    onMount(() => {
        const initial = get(pageParams);
        stakingMode = initial.stakingMode;
        hideEmpty = initial.hideEmpty;
        typeFilter = initial.typeFilter;
        urlInitialized = true;
    });

    $effect(() => {
        if (!urlInitialized) return;
        // Only write a value when it differs from the default so the URL
        // stays clean for the common-case (no flags set, empty filter).
        updatePageQueryParams({
            stakingMode: stakingMode ? 'true' : null,
            hideEmpty: hideEmpty ? null : 'false',
            typeFilter: typeFilter || null,
        });
    });

    function accountIsEmpty(a: ExtendedAccount): boolean {
        return a.objects.length === 0 && a.timelockedObjects.length === 0;
    }

    function accountHasMatchingObject(a: ExtendedAccount, filter: string): boolean {
        if (!filter) return true;
        const match = (obj: any) => {
            const t = obj?.data?.content?.type;
            return typeof t === 'string' && t.toLowerCase().includes(filter);
        };
        return a.objects.some(match) || a.timelockedObjects.some(match);
    }

    /** Cards to actually render. Solo overrides everything else; otherwise we
     *  apply hide/empty/filter in turn. The filter also drops accounts with no
     *  matching objects so the user isn't left with empty cards while
     *  searching. */
    let visibleAccounts = $derived.by(() => {
        if (soloAddress) {
            return extendedAccounts.filter((a) => a.address === soloAddress);
        }
        return extendedAccounts.filter((a) => {
            if (hiddenAddresses.has(a.address)) return false;
            // Per-chip forced visibility wins over hideEmpty/filter — it's
            // the user explicitly saying "I want to see this one anyway".
            if (forceVisibleAddresses.has(a.address)) return true;
            if (hideEmpty && accountIsEmpty(a)) return false;
            if (normalizedTypeFilter && !accountHasMatchingObject(a, normalizedTypeFilter))
                return false;
            return true;
        });
    });

    let soloLabel = $derived.by(() => {
        if (!soloAddress) return null;
        const acc = extendedAccounts.find((a) => a.address === soloAddress);
        return acc?.label || soloAddress.slice(0, 6) + '...' + soloAddress.slice(-4);
    });

    /** Set of addresses that pass all filters and would render. The chip strip
     *  uses this to gray out anything not currently in the grid (regardless of
     *  *why* it's hidden — solo, manual hide, hide-empty, or type filter). */
    let visibleAddressSet = $derived(new Set(visibleAccounts.map((a) => a.address)));

    /** Toggle visibility for a chip click. A click always flips the chip
     *  between visible and dimmed, regardless of *why* it was dimmed:
     *   - in solo mode, click on the soloed chip exits solo; click on any
     *     other chip switches solo to that one;
     *   - if currently visible, hide it (`hiddenAddresses`);
     *   - if dimmed by manual hide, unhide;
     *   - if dimmed by `hideEmpty` or the type filter, force-show
     *     (`forceVisibleAddresses`) so the user sees it even though the
     *     global rule would have hidden it;
     *   - if already force-shown, click again clears the override. */
    function toggleAccountChip(address: string) {
        if (soloAddress) {
            if (soloAddress === address) soloAddress = null;
            else soloAddress = address;
            return;
        }
        if (hiddenAddresses.has(address)) {
            const next = new Set(hiddenAddresses);
            next.delete(address);
            hiddenAddresses = next;
            return;
        }
        if (forceVisibleAddresses.has(address)) {
            const next = new Set(forceVisibleAddresses);
            next.delete(address);
            forceVisibleAddresses = next;
            return;
        }
        if (visibleAddressSet.has(address)) {
            hideAccount(address);
        } else {
            const next = new Set(forceVisibleAddresses);
            next.add(address);
            forceVisibleAddresses = next;
        }
    }

    function hideAccount(address: string) {
        const next = new Set(hiddenAddresses);
        next.add(address);
        hiddenAddresses = next;
        if (soloAddress === address) soloAddress = null;
    }
    function soloAccountAction(address: string) {
        soloAddress = address;
    }
    function clearHidden() {
        hiddenAddresses = new Set();
    }
    function clearSolo() {
        soloAddress = null;
    }

    /** Lifted out of BalanceSummary so the staking views (validator table,
     *  optimize panel, charts) can render fiat values consistently. The
     *  price is fetched once on mount; the currency selector lives in
     *  BalanceSummary and is two-way bound. */
    let selectedCurrency = $state<Currency>(get(sharedMultiAccountCurrency));
    let currentPrice = $state<FiatPrice>(null);
    let priceFetched = false;
    /** When on, IOTA amounts in the account cards, per-object rows, and the
     *  breakdown table are rounded to 2 decimals instead of the full nano
     *  tail. Persisted via `sharedMultiAccountCompactAmounts`. */
    let compactAmounts = $state<boolean>(get(sharedMultiAccountCompactAmounts));

    $effect(() => {
        sharedMultiAccountCurrency.set(selectedCurrency);
    });

    $effect(() => {
        sharedMultiAccountCompactAmounts.set(compactAmounts);
    });

    // ─── Staking state ───────────────────────────────────────────────────────
    let selectedTimeFrame: StakingTimeFrame = $state('last-30-days');
    let metricType: StakingMetricType = $state('rewards');
    let validators = $state<ValidatorInfoFull[]>([]);
    let currentEpoch = $state(0);
    let stakingLoading = $state(false);
    let stakingError = $state('');
    /** External focus signal sent to the trend chart when the user clicks
     *  Optimize on a stake card. The chart consumes the value (replaces its
     *  selection with this stake, opens itself, scrolls into view) and
     *  resets it back to null via $bindable. */
    let chartFocusStake = $state<string | null>(null);
    /** Switch-target validator address shared between the trend chart's switch
     *  picker and the new-stake flow. Lifting it here means the chart's
     *  validator pick is reused as the destination for staking new liquid
     *  IOTA from any account. */
    let switchTargetAddress = $state<string>('');
    /** A pending "stake new liquid IOTA from account X" intent. Set when the
     *  user clicks Stake on an AccountCard. The trend chart consumes this
     *  via $bindable: opens itself, clears any existing-stake selection,
     *  shows a banner with the amount + source account, and exposes a
     *  "Stake" action that calls back into `executeStake`. After a
     *  successful execute (or explicit cancel) the chart clears it. */
    let pendingNewStake = $state<{
        accountAddress: string;
        accountLabel: string;
        amountNano: bigint;
    } | null>(null);
    let cacheInitialized = false;

    // Pool-id index derived from `validators` so callers can do O(1) lookups
    // without iterating the full list.
    let validatorsByPool = $derived(new Map(validators.map((v) => [v.poolId, v])));

    // Per-pool sum of the user's staked principal across all synced accounts.
    // The Set of pool ids is derived from the keys for callers that just need
    // membership; the bigint values feed the comparison table's "your stake"
    // amount + percentage display.
    let userStakeByPool = $derived.by(() => {
        const map = new Map<string, bigint>();
        for (const acc of extendedAccounts) {
            for (const obj of acc.objects) {
                if (obj.label !== 'StakedIota') continue;
                const poolId = obj.data?.content?.fields?.pool_id;
                const principal = obj.data?.content?.fields?.principal;
                if (!poolId || !principal) continue;
                map.set(poolId, (map.get(poolId) ?? 0n) + BigInt(principal));
            }
        }
        return map;
    });
    let userPoolIds = $derived(new Set(userStakeByPool.keys()));

    let epochRange = $derived(timeFrameToEpochRange(selectedTimeFrame, currentEpoch || 1));

    // Net APR per pool over the chosen window. Computed once so the per-stake
    // metric computation and the "best alternative" check both reuse it.
    let aprByPool = $derived.by(() => {
        const map = new Map<string, number>();
        for (const v of validators) {
            map.set(
                v.poolId,
                poolNetAprOverWindow(v.poolId, epochRange.fromEpoch, epochRange.toEpoch),
            );
        }
        return map;
    });

    let bestCommitteeApr = $derived.by(() => {
        let best = 0;
        for (const v of validators) {
            if (!v.isCommittee) continue;
            const apr = aprByPool.get(v.poolId) ?? 0;
            if (apr > best) best = apr;
        }
        return best;
    });

    /** Flat list of the user's StakedIota objects with each one's resolved
     *  validator attached. Drives the per-stake selector inside
     *  StakingTrendChart. Excludes timelocked stakes (handled separately). */
    let userStakeRefs = $derived.by<UserStakeRef[]>(() => {
        const refs: UserStakeRef[] = [];
        for (const acc of extendedAccounts) {
            for (const obj of acc.objects) {
                if (obj.label !== 'StakedIota') continue;
                const poolId = obj.data?.content?.fields?.pool_id;
                const principal = obj.data?.content?.fields?.principal;
                if (!poolId || !principal) continue;
                const validator = validatorsByPool.get(poolId);
                if (!validator) continue;
                refs.push({
                    stakeId: obj.id,
                    accountAddress: acc.address,
                    accountLabel:
                        acc.label || acc.address.slice(0, 6) + '…' + acc.address.slice(-4),
                    principal: BigInt(principal),
                    validator,
                });
            }
        }
        return refs;
    });

    /** The lowest known net APR among the user's current stakes. Used by the
     *  validator-comparison table as the "old APR" baseline when computing
     *  per-row break-even days. The minimum (rather than weighted average) is
     *  the more actionable number: "if I moved my weakest-yielding stake to
     *  this validator, when does it pay off?". An average comparison would
     *  hide every validator that beats some of your stakes but not others.
     *
     *  Pools whose APR isn't yet computed (returns 0 — usually missing
     *  exchange-rate data) are skipped so they don't pin the minimum to 0
     *  and make every other row look profitable.
     *
     *  Returns 0 when the user has no stakes (or no stakes with known APR),
     *  which the table renders as "—". */
    let userMinNetApr = $derived.by(() => {
        let min = Infinity;
        for (const poolId of userStakeByPool.keys()) {
            const apr = aprByPool.get(poolId) ?? 0;
            if (apr <= 0) continue;
            if (apr < min) min = apr;
        }
        return min === Infinity ? 0 : min;
    });

    /** Per-stake metric block, keyed by stake object id. Only populated for
     *  StakedIota objects whose pool is known to us. Timelocked stakes are
     *  intentionally omitted — see Toolbar staking-mode comment. */
    let stakingMetrics = $derived.by(() => {
        if (!stakingMode || validators.length === 0) return new Map<string, StakingMetricInfo>();
        const map = new Map<string, StakingMetricInfo>();
        for (const acc of extendedAccounts) {
            for (const obj of acc.objects) {
                if (obj.label !== 'StakedIota') continue;
                const poolId = obj.data?.content?.fields?.pool_id;
                const principalRaw = obj.data?.content?.fields?.principal;
                const activationEpochRaw = obj.data?.content?.fields?.stake_activation_epoch;
                if (!poolId || !principalRaw) continue;
                const validator = validatorsByPool.get(poolId);
                if (!validator) continue;

                const principal = BigInt(principalRaw);
                const activationEpoch = activationEpochRaw ? parseInt(activationEpochRaw) : 0;

                const ourApr = aprByPool.get(poolId) ?? 0;
                const rewardsFraction = poolReturnOverWindow(
                    poolId,
                    epochRange.fromEpoch,
                    epochRange.toEpoch,
                );
                // Actual IOTA earned in the chosen window for this specific
                // stake (uses the stake's activation epoch + principal). Used
                // by the per-stake badge to show "Window rewards X% (Y IOTA)".
                const rewardsInWindow = stakeRewardsInWindow(
                    poolId,
                    principal,
                    activationEpoch,
                    epochRange.fromEpoch,
                    epochRange.toEpoch,
                );
                // Show "Optimize" prominently when at least one other committee
                // validator has materially higher net APR (≥0.1% absolute gap).
                const hasBetterAlternative = bestCommitteeApr - ourApr > 0.001;

                map.set(obj.id, {
                    metricType,
                    // IIP-8 effective commission, not the declared rate —
                    // see `effectiveCommissionBps` for the rationale.
                    commissionPct: effectiveCommissionBps(validator) / 100,
                    rewardsFractionInWindow: rewardsFraction,
                    rewardsInWindowNano: rewardsInWindow,
                    principalNano: principal,
                    validatorName: validator.name,
                    hasBetterAlternative,
                });
            }
        }
        return map;
    });

    /** Non-reactive in-flight flag so the load can early-return without
     *  re-triggering the $effect below. The $state-backed `stakingLoading`
     *  is only used for UI display. */
    let stakingDataInFlight = false;

    // Auto-load staking data when the mode is first toggled on, or when the
    // account set has changed (e.g. after a sync). The exchange-rate cache is
    // initialized lazily here so users who never enter staking mode don't pay
    // the cost.
    //
    // The work is wrapped in `untrack` because Svelte 5 tracks reactive reads
    // and writes through called async functions. Without it, every state
    // write in loadStakingData (`stakingLoading`, `validators`, `currentEpoch`)
    // would re-trigger this effect — and since loadStakingData ends with
    // `stakingLoading = false`, the effect would loop forever, hammering
    // `getLatestIotaSystemState` and `getProtocolConfig` on the RPC node.
    $effect(() => {
        if (!stakingMode) return;
        // Re-trigger when the set of user pools changes (new sync).
        void userPoolIds.size;
        untrack(() => {
            if (!stakingDataInFlight) loadStakingData();
        });
    });

    async function loadStakingData() {
        if (stakingDataInFlight) return;
        stakingDataInFlight = true;
        try {
            stakingLoading = true;
            stakingError = '';
            if (!cacheInitialized) {
                setInitialExchangeRateCacheFromBinary(exchangeRateCacheBinary);
                cacheInitialized = true;
            }
            const { validators: list, currentEpoch: ep } = await fetchValidatorsForStaking();
            validators = list;
            currentEpoch = ep;

            // Warm any missing recent epochs for pools the user is staking with.
            // Cheap when the bundled cache already covers them.
            if (userPoolIds.size > 0) {
                try {
                    await fetchAllExchangeRates(ep, userPoolIds);
                } catch (err) {
                    console.warn('Warming exchange-rate cache failed (non-fatal):', err);
                }
            }
        } catch (err: any) {
            stakingError = err?.toString() ?? 'Failed to load staking data';
            console.error(err);
        } finally {
            stakingLoading = false;
            stakingDataInFlight = false;
        }
    }

    // ─── Sync / mutation flows (transfers) ───────────────────────────────────
    /** Re-entrancy guard so a click while a sync is in flight is a no-op. The
     *  $state-backed `syncing` is what the toolbar reads to disable the
     *  button + show the spinner; this duplicate non-reactive flag survives
     *  reactivity edge-cases (e.g. an effect firing before `syncing` flushes). */
    let syncInFlight = false;
    const syncReset = async () => {
        if (syncInFlight) return;
        syncInFlight = true;
        syncing = true;
        try {
            syncError = '';
            const externalAccounts = extendedAccounts.filter(
                (acc) => !$iota_accounts.some((iotaAcc) => iotaAcc.address === acc.address),
            );
            const iotaAccounts = $iota_accounts.map((account) => ({
                id: account.address,
                address: account.address,
                label: account.label,
                objects: [],
                timelockedObjects: [],
                stakingRewards: BigInt(0),
                isCollapsed: false,
            }));
            extendedAccounts = [...iotaAccounts, ...externalAccounts];

            try {
                extendedAccounts = await getObjectsForAccounts(extendedAccounts);
            } catch (err: any) {
                syncError = err.toString();
                console.error(err);
            }
            try {
                extendedAccounts = await computeAllStakingRewards(extendedAccounts);
            } catch (err: any) {
                syncError = err.toString();
                console.error(err);
            }
            // When staking mode is on, also refresh validator info + warm any
            // missing recent exchange rates. Without this, Sync only updates
            // owned objects + accumulated rewards but the comparison table
            // still reflects the staking snapshot from the last load.
            if (stakingMode) {
                try {
                    await loadStakingData();
                } catch (err: any) {
                    console.error('Refreshing staking data during sync failed:', err);
                }
            }
        } catch (err: any) {
            syncError = err.toString();
            console.error(err);
        } finally {
            syncing = false;
            syncInFlight = false;
        }
    };

    /** Auto-trigger sync so the user lands on a populated view without
     *  needing to click. Tracks `$iota_accounts.length` so that the WebWallet
     *  signer — which populates accounts asynchronously after `wallet.connect()`
     *  resolves — also gets auto-synced once they hydrate. The Localstorage
     *  signer populates synchronously, so for it this still effectively runs
     *  once on mount. The rest is wrapped in `untrack` to avoid the kind of
     *  reactivity loop that bit `loadStakingData` previously. */
    $effect(() => {
        const iotaCount = $iota_accounts.length;
        untrack(() => {
            if (extendedAccounts.length === 0 && iotaCount > 0 && !syncInFlight) syncReset();
        });
    });

    /** Auto-fetch the IOTA price once per visit so fiat values appear
     *  alongside IOTA amounts everywhere (badges, optimize panel, chart
     *  tooltips). The Fetch Price button in BalanceSummary lets the user
     *  refresh manually. */
    $effect(() => {
        untrack(() => {
            if (priceFetched) return;
            priceFetched = true;
            // Auto-fetch tolerates cached values up to 1 hour old to avoid
            // hammering CoinGecko on every page load. The Fetch Price
            // button in BalanceSummary calls without `maxAgeMs` so users
            // can always force a fresh read.
            fetchCurrentPrice({ maxAgeMs: 60 * 60 * 1000 })
                .then((p) => {
                    currentPrice = p;
                })
                .catch((err) => console.warn('Initial price fetch failed:', err));
        });
    });

    function handleDnd(event: CustomEvent<DndEvent<any>>, accountId: string) {
        const idx = extendedAccounts.findIndex((acc) => acc.address === accountId);
        if (idx === -1) return;
        const seen = new Set();
        const uniqueItems = event.detail.items.filter((item) => {
            if (seen.has(item.id)) return false;
            seen.add(item.id);
            return true;
        });
        extendedAccounts = [
            ...extendedAccounts.slice(0, idx),
            { ...extendedAccounts[idx], objects: uniqueItems },
            ...extendedAccounts.slice(idx + 1),
        ];
    }

    function shortAddrLabel(a: string): string {
        const acc = extendedAccounts.find((x) => x.address === a);
        if (acc?.label) return acc.label;
        return a.length > 14 ? `${a.slice(0, 6)}…${a.slice(-4)}` : a;
    }

    async function executeTransfers() {
        try {
            const prepared = prepareTransferTransactions(extendedAccounts);
            // Push every prepared transaction onto the global tray. Each card
            // runs independently so a re-run on one tx leaves the others alone.
            for (const { sender, recipients, transaction } of prepared) {
                const recipientLabels = recipients.map(shortAddrLabel).join(', ');
                addAndRun({
                    label: `Transfer from ${shortAddrLabel(sender)} → ${recipientLabels}`,
                    transaction,
                    sender,
                    recipients,
                });
            }
        } catch (err: any) {
            console.error(err);
            alert(err.toString());
        }
    }

    function addExternalAccount() {
        const address = newAccountAddress.trim();
        newAccountError = '';
        if (!address) {
            newAccountError = 'Address is required.';
            return;
        }
        if (!isValidIotaAddress(address)) {
            newAccountError = 'Invalid IOTA address.';
            return;
        }
        if (
            extendedAccounts.some((acc) => acc.address === address) ||
            $iota_accounts.some((acc) => acc.address === address)
        ) {
            newAccountError = 'Account already exists.';
            return;
        }
        extendedAccounts = [
            ...extendedAccounts,
            {
                id: address,
                address,
                label: 'External: ' + address.slice(0, 6) + '...' + address.slice(-4),
                objects: [],
                timelockedObjects: [],
                stakingRewards: BigInt(0),
                isCollapsed: false,
            },
        ];
        newAccountAddress = '';
    }

    function removeAccount(address: string) {
        extendedAccounts = extendedAccounts.filter((acc) => acc.address !== address);
        if (hiddenAddresses.has(address)) {
            const next = new Set(hiddenAddresses);
            next.delete(address);
            hiddenAddresses = next;
        }
        if (forceVisibleAddresses.has(address)) {
            const next = new Set(forceVisibleAddresses);
            next.delete(address);
            forceVisibleAddresses = next;
        }
        if (soloAddress === address) soloAddress = null;
    }

    function getAccountDisplayName(address: string): string {
        const acc = extendedAccounts.find((a) => a.address === address);
        const fallback = address.slice(0, 6) + '...' + address.slice(-4);
        return acc?.label || fallback;
    }

    function toggleCollapse(accountId: string) {
        const idx = extendedAccounts.findIndex((acc) => acc.id === accountId);
        if (idx === -1) return;
        extendedAccounts[idx] = {
            ...extendedAccounts[idx],
            isCollapsed: !extendedAccounts[idx].isCollapsed,
        };
    }

    // ─── Staking actions ─────────────────────────────────────────────────────
    /** Per-stake "Optimize" click in an account card → focus the trend chart
     *  on this stake. The chart owns the actual layout (mode switch, scroll,
     *  selection replacement). */
    function openOptimize(stakeId: string) {
        chartFocusStake = stakeId;
    }

    /** Per-card "Stake X IOTA" click → record the intent and let the chart
     *  pick it up. The chart focuses itself, clears its existing-stake
     *  selection, auto-picks a target validator (or honors the existing one),
     *  and shows a confirm banner — no transaction is built here. */
    function requestStake(accountAddress: string, amountNano: bigint) {
        const acc = extendedAccounts.find((a) => a.address === accountAddress);
        const fallback = accountAddress.slice(0, 6) + '...' + accountAddress.slice(-4);
        pendingNewStake = {
            accountAddress,
            accountLabel: acc?.label || fallback,
            amountNano,
        };
    }

    /** Build + execute a stake transaction for a pending new-stake intent.
     *  Called by the chart's confirm button — the chart owns validator
     *  selection so passes it explicitly here, decoupling the action from
     *  the shared `switchTargetAddress` state. */
    async function executeStake(
        accountAddress: string,
        amountNano: bigint,
        target: ValidatorInfoFull,
    ) {
        if (amountNano <= 0n) {
            alert('Stake amount must be > 0.');
            return;
        }
        try {
            const tx = buildStakeTransaction(target.address, amountNano);
            tx.setSender(accountAddress);
            await addAndRun({
                label: `Stake from ${shortAddrLabel(accountAddress)} → ${target.name || shortAddrLabel(target.address)}`,
                transaction: tx,
                sender: accountAddress,
                recipients: [target.address],
            });
            pendingNewStake = null;
        } catch (err: any) {
            console.error(err);
            alert(err.toString());
        }
    }

    /** Build and execute switch transactions for the selected stakes,
     *  grouped by sending account so each PTB has a single sender. The
     *  trend chart calls this with whichever stakes the user picked. */
    async function executeSwitch(stakes: UserStakeRef[], newValidator: ValidatorInfoFull) {
        if (stakes.length === 0) return;
        try {
            const byAccount = new Map<string, UserStakeRef[]>();
            for (const s of stakes) {
                const list = byAccount.get(s.accountAddress) ?? [];
                list.push(s);
                byAccount.set(s.accountAddress, list);
            }
            // Each (account → validator) pair becomes its own tray card so the
            // user can re-run them individually after a successful dry-run.
            for (const [account, accountStakes] of byAccount) {
                try {
                    const tx = buildSwitchValidatorTransactionMulti(
                        accountStakes.map((s) => s.stakeId),
                        newValidator.address,
                    );
                    tx.setSender(account);
                    addAndRun({
                        label: `Switch ${accountStakes.length} stake${accountStakes.length === 1 ? '' : 's'} (${shortAddrLabel(account)}) → ${newValidator.name || shortAddrLabel(newValidator.address)}`,
                        transaction: tx,
                        sender: account,
                        recipients: [newValidator.address],
                    });
                } catch (err: any) {
                    console.error(err);
                    alert(
                        `Failed to build switch tx for ${shortAddrLabel(account)}: ${err.toString()}`,
                    );
                }
            }
        } catch (err: any) {
            console.error(err);
            alert(err.toString());
        }
    }
</script>

<main class="container">
    <BalanceSummary
        accounts={visibleAccounts}
        bind:selectedCurrency
        bind:currentPrice
        bind:compactAmounts
    />

    <Toolbar
        bind:newAccountAddress
        bind:stakingMode
        bind:typeFilter
        {numTransfers}
        {syncing}
        hiddenCount={hiddenAddresses.size}
        {soloLabel}
        onSync={syncReset}
        onAddExternalAccount={addExternalAccount}
        onExecuteTransfers={executeTransfers}
        onClearHidden={clearHidden}
        onClearSolo={clearSolo}
    />

    {#if newAccountError}
        <div style="color: #ef4444; padding: 0 0.5rem;">{newAccountError}</div>
    {/if}

    {#if syncError}
        <div style="color: #ef4444; padding: 0 0.5rem;">{syncError}</div>
    {/if}

    {#if extendedAccounts.length > 0}
        <div
            class="account-strip"
            title="All accounts. Greyed-out chips are hidden from the grid below — click to toggle. In solo mode, click another chip to switch solo, or click the active chip to exit solo."
        >
            <label class="strip-toggle" title="Hide accounts with no objects.">
                <input type="checkbox" bind:checked={hideEmpty} />
                <span>Hide empty</span>
            </label>
            <span class="strip-divider" aria-hidden="true"></span>
            {#each extendedAccounts as a (a.id)}
                {@const visible = visibleAddressSet.has(a.address)}
                {@const isSolo = soloAddress === a.address}
                <button
                    type="button"
                    class="account-chip"
                    class:dim={!visible}
                    class:solo={isSolo}
                    onclick={() => toggleAccountChip(a.address)}
                >
                    {a.label || a.address.slice(0, 6) + '...' + a.address.slice(-4)}
                </button>
            {/each}
        </div>
    {/if}

    <div class="accounts-grid">
        {#each visibleAccounts as account (account.id)}
            <AccountCard
                {account}
                {stakingMode}
                {getAccountDisplayName}
                typeFilter={normalizedTypeFilter}
                onDnd={(event) => handleDnd(event, account.id)}
                onRemove={() => removeAccount(account.address)}
                onHide={() => hideAccount(account.address)}
                onSolo={() => soloAccountAction(account.address)}
                onToggleCollapse={() => toggleCollapse(account.id)}
                stakingMetrics={stakingMode ? stakingMetrics : undefined}
                onOptimizeStake={stakingMode ? openOptimize : undefined}
                onRequestStake={stakingMode ? requestStake : undefined}
                {currentPrice}
                {selectedCurrency}
                {compactAmounts}
            />
        {/each}

        {#if visibleAccounts.length === 0 && extendedAccounts.length > 0}
            <div class="empty-hint">
                No accounts to show.
                {#if soloAddress}Exit solo view{:else if hiddenAddresses.size > 0 || hideEmpty || normalizedTypeFilter}adjust
                    the filters above{:else}sync to load{/if}.
            </div>
        {/if}
    </div>

    {#if stakingMode}
        <div class="disclaimer">
            <strong>Not financial advice.</strong> The numbers shown here are computed from a bundled
            snapshot of on-chain exchange rates and may be incomplete, stale, or wrong. Past validator
            performance does not guarantee future returns — commission rates and uptime can change at
            any time. Verify before acting.
        </div>

        <StakingControls
            bind:timeFrame={selectedTimeFrame}
            bind:metricType
            loading={stakingLoading}
            loadError={stakingError}
            validatorsLoaded={validators.length || undefined}
        />

        {#if validators.length > 0}
            <StakingTrendChart
                {validators}
                fromEpoch={epochRange.fromEpoch}
                toEpoch={epochRange.toEpoch}
                {userPoolIds}
                userStakes={userStakeRefs}
                {aprByPool}
                {currentPrice}
                {selectedCurrency}
                bind:focusStakeRequest={chartFocusStake}
                bind:switchTargetAddress
                bind:pendingNewStake
                onSwitch={executeSwitch}
                onStakeNew={executeStake}
            />
        {/if}
    {/if}

    {#if stakingMode && validators.length > 0}
        <ValidatorComparisonTable
            {validators}
            timeFrame={selectedTimeFrame}
            fromEpoch={epochRange.fromEpoch}
            toEpoch={epochRange.toEpoch}
            {userStakeByPool}
            {userMinNetApr}
            {currentPrice}
            {selectedCurrency}
        />
    {/if}
</main>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
    }

    .accounts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1rem;
        padding-bottom: 0.5rem;
    }

    .disclaimer {
        font-size: 0.78rem;
        color: var(--text-muted);
        background: rgba(245, 158, 11, 0.06);
        border: 1px solid rgba(245, 158, 11, 0.25);
        border-radius: 6px;
        padding: 0.5rem 0.75rem;
        margin: 0.5rem 0;
        line-height: 1.4;
    }

    .disclaimer strong {
        color: #fbbf24;
    }

    .empty-hint {
        grid-column: 1 / -1;
        text-align: center;
        color: var(--text-muted);
        font-size: 0.85rem;
        padding: 1.5rem;
        border: 1px dashed var(--border-color);
        border-radius: 6px;
    }

    .account-strip {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.35rem;
        padding: 0.4rem 0.5rem;
        margin: 0.25rem 0 0.5rem;
        border: 1px solid var(--border-color);
        border-radius: 6px;
        background: rgba(0, 0, 0, 0.15);
    }

    .strip-toggle {
        display: inline-flex;
        align-items: center;
        gap: 0.3rem;
        font-size: 0.78rem;
        color: var(--text-muted);
        cursor: pointer;
        user-select: none;
    }

    .strip-toggle input {
        accent-color: #6366f1;
    }

    .strip-divider {
        width: 1px;
        align-self: stretch;
        background: var(--border-color);
        margin: 0 0.25rem;
    }

    .account-chip {
        font-size: 0.75rem;
        padding: 0.2rem 0.55rem;
        border-radius: 999px;
        border: 1px solid rgba(100, 116, 139, 0.4);
        background: rgba(100, 116, 139, 0.18);
        color: rgba(255, 255, 255, 0.85);
        cursor: pointer;
        max-width: 14rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .account-chip:hover {
        background: rgba(100, 116, 139, 0.32);
    }

    .account-chip.dim {
        opacity: 0.4;
        text-decoration: line-through;
    }

    .account-chip.solo {
        background: rgba(99, 102, 241, 0.3);
        border-color: rgba(99, 102, 241, 0.6);
        color: #c7d2fe;
    }
</style>

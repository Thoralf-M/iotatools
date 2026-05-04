<script lang="ts">
    import { isValidIotaAddress } from '@iota/iota-sdk/utils';
    import { untrack } from 'svelte';
    import type { DndEvent } from 'svelte-dnd-action';

    import { iota_accounts } from '../../utils/signer-data';
    import { executeTransaction } from '../../utils/transaction-execution';
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
    import { buildSwitchValidatorTransactionMulti } from './staking-transactions';
    import StakingControls, { type StakingMetricType } from './StakingControls.svelte';
    import StakingTrendChart, { type UserStakeRef } from './StakingTrendChart.svelte';
    import Toolbar from './Toolbar.svelte';
    import TransactionResults from './TransactionResults.svelte';
    import {
        executeTransferTransactions,
        getMovements,
        prepareTransferTransactions,
    } from './transfer-transactions';
    import {
        effectiveCommissionBps,
        fetchValidatorsForStaking,
        type ValidatorInfoFull,
    } from './validator-info';
    import ValidatorComparisonTable from './ValidatorComparisonTable.svelte';

    // ─── Core multi-account state ────────────────────────────────────────────
    let extendedAccounts: ExtendedAccount[] = $state([]);
    let transactionResults: any[] = $state([]);
    let syncError = $state('');
    let newAccountAddress = $state('');
    let newAccountError = $state('');
    let stakingMode = $state(false);
    let syncing = $state(false);
    let numTransfers = $derived(getMovements(extendedAccounts).size);

    /** Lifted out of BalanceSummary so the staking views (validator table,
     *  optimize panel, charts) can render fiat values consistently. The
     *  price is fetched once on mount; the currency selector lives in
     *  BalanceSummary and is two-way bound. */
    let selectedCurrency = $state<Currency>('USD');
    let currentPrice = $state<FiatPrice>(null);
    let priceFetched = false;

    // ─── Staking state ───────────────────────────────────────────────────────
    let selectedTimeFrame: StakingTimeFrame = $state('last-7-days');
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
    let cacheInitialized = false;

    // Indexes derived from `validators`. Re-derive on change so callers can
    // do O(1) lookups without iterating the full list.
    let validatorsByPool = $derived(new Map(validators.map((v) => [v.poolId, v])));
    let validatorsByAddress = $derived(new Map(validators.map((v) => [v.address, v])));

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

    /** Auto-trigger sync once on mount so the user lands on a populated view
     *  without needing to click. Wrapped in `untrack` to avoid the same kind
     *  of reactivity loop that bit `loadStakingData` previously. */
    $effect(() => {
        untrack(() => {
            if (extendedAccounts.length === 0 && !syncInFlight) syncReset();
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

    async function executeTransfers() {
        try {
            transactionResults = [];
            const prepared = prepareTransferTransactions(extendedAccounts);
            transactionResults = await executeTransferTransactions(prepared);
        } catch (err: any) {
            transactionResults = [{ error: err.toString() }];
            console.error(err);
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

    /** Build and execute switch transactions for the selected stakes,
     *  grouped by sending account so each PTB has a single sender. The
     *  trend chart calls this with whichever stakes the user picked. */
    async function executeSwitch(stakes: UserStakeRef[], newValidator: ValidatorInfoFull) {
        if (stakes.length === 0) return;
        try {
            transactionResults = [];
            const byAccount = new Map<string, UserStakeRef[]>();
            for (const s of stakes) {
                const list = byAccount.get(s.accountAddress) ?? [];
                list.push(s);
                byAccount.set(s.accountAddress, list);
            }
            const results: any[] = [];
            for (const [account, accountStakes] of byAccount) {
                try {
                    const tx = buildSwitchValidatorTransactionMulti(
                        accountStakes.map((s) => s.stakeId),
                        newValidator.address,
                    );
                    tx.setSender(account);
                    const result: any = await executeTransaction(tx);
                    result.sender = account;
                    result.recipients = [newValidator.address];
                    results.push(result);
                } catch (err: any) {
                    results.push({ error: err.toString(), sender: account });
                    console.error(err);
                }
            }
            transactionResults = results;
        } catch (err: any) {
            transactionResults = [{ error: err.toString() }];
            console.error(err);
        }
    }
</script>

<main class="container">
    <Toolbar
        bind:newAccountAddress
        bind:stakingMode
        {numTransfers}
        {syncing}
        onSync={syncReset}
        onAddExternalAccount={addExternalAccount}
        onExecuteTransfers={executeTransfers}
    />

    {#if newAccountError}
        <div style="color: #ef4444; padding: 0 0.5rem;">{newAccountError}</div>
    {/if}

    {#if syncError}
        <div style="color: #ef4444; padding: 0 0.5rem;">{syncError}</div>
    {/if}

    {#if stakingMode}
        <div class="disclaimer">
            <strong>Not financial advice.</strong> The numbers shown here are computed from a bundled
            snapshot of on-chain exchange rates and may be incomplete, stale, or wrong. Past validator
            performance does not guarantee future returns — commission rates and uptime can change at
            any time. Verify before acting.
        </div>

        <BalanceSummary
            accounts={extendedAccounts}
            {stakingMode}
            bind:selectedCurrency
            bind:currentPrice
        />

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
                onSwitch={executeSwitch}
            />

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
    {/if}

    <TransactionResults
        results={transactionResults}
        {getAccountDisplayName}
        title={stakingMode ? 'Staking / transfer transactions' : 'Transfers'}
    />

    <div class="accounts-grid">
        {#each extendedAccounts as account (account.id)}
            <AccountCard
                {account}
                {stakingMode}
                {getAccountDisplayName}
                onDnd={(event) => handleDnd(event, account.id)}
                onRemove={() => removeAccount(account.address)}
                onToggleCollapse={() => toggleCollapse(account.id)}
                stakingMetrics={stakingMode ? stakingMetrics : undefined}
                onOptimizeStake={stakingMode ? openOptimize : undefined}
                {currentPrice}
                {selectedCurrency}
            />
        {/each}
    </div>
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
</style>

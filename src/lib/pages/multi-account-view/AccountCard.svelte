<script lang="ts">
    import { dragHandleZone, type DndEvent } from 'svelte-dnd-action';

    import { iotaToNano, nanoToIota } from '../../utils/iota-nano-conversion';
    import {
        accountTotalBalance,
        formatIotaAmount,
        isStakeObject,
        objectIotaCoinAmount,
        type Currency,
        type FiatPrice,
    } from './balance-utils';
    import type { ExtendedAccount } from './multi-account-service';
    import ObjectItem, { type StakingMetricInfo } from './ObjectItem.svelte';

    interface Props {
        account: ExtendedAccount;
        stakingMode: boolean;
        getAccountDisplayName: (address: string) => string;
        onDnd: (event: CustomEvent<DndEvent<any>>) => void;
        onRemove: () => void;
        onHide: () => void;
        onSolo: () => void;
        onToggleCollapse: () => void;
        /** Global, partial, case-insensitive substring filter on the Move type
         *  string of each object. Empty string disables filtering. When set,
         *  DnD is disabled because the rendered list is a subset and a drag
         *  reorder would silently drop the hidden objects. */
        typeFilter?: string;
        /** Per-stake-object metric block, keyed by stake object id. Only set in
         *  staking mode and only for objects whose pool is known. */
        stakingMetrics?: Map<string, StakingMetricInfo>;
        /** Callback when the user clicks Optimize/Compare on a stake. */
        onOptimizeStake?: (stakeId: string) => void;
        /** Triggered by the "Stake X IOTA" button. Does NOT execute a
         *  transaction — the host instead jumps to the trend chart with this
         *  pending new-stake selected, where the user reviews and confirms.
         *  The chart owns validator selection and the actual Stake action. */
        onRequestStake?: (accountAddress: string, amountNano: bigint) => void;
        /** Forwarded to per-stake badges for IOTA→fiat conversion. */
        currentPrice?: FiatPrice;
        selectedCurrency?: Currency;
        /** When true, IOTA amounts on per-object rows and the per-account
         *  total are rounded to 2 decimals. Toggled in BalanceSummary. */
        compactAmounts?: boolean;
    }

    let {
        account,
        stakingMode,
        getAccountDisplayName,
        onDnd,
        onRemove,
        onHide,
        onSolo,
        onToggleCollapse,
        typeFilter = '',
        stakingMetrics,
        onOptimizeStake,
        onRequestStake,
        currentPrice = null,
        selectedCurrency = 'USD',
        compactAmounts = false,
    }: Props = $props();

    let displayLabel = $derived(
        account.label || account.address.slice(0, 6) + '...' + account.address.slice(-4),
    );
    let totalBalance = $derived(accountTotalBalance(account));
    let objectCount = $derived(account.objects.length + account.timelockedObjects.length);

    let normalizedTypeFilter = $derived(typeFilter.trim().toLowerCase());
    let isFiltered = $derived(normalizedTypeFilter.length > 0);

    function matchesTypeFilter(obj: { data?: any }): boolean {
        if (!isFiltered) return true;
        const t = obj?.data?.content?.type;
        return typeof t === 'string' && t.toLowerCase().includes(normalizedTypeFilter);
    }

    // Type-filtered views. DnD operates on the unfiltered list; we only render
    // the filtered subset when a filter is active.
    let visibleObjects = $derived(
        isFiltered ? account.objects.filter(matchesTypeFilter) : account.objects,
    );
    let visibleTimelocked = $derived(
        isFiltered
            ? account.timelockedObjects.filter(matchesTypeFilter)
            : account.timelockedObjects,
    );
    let visibleCount = $derived(visibleObjects.length + visibleTimelocked.length);

    // In staking mode we show only StakedIota / TimelockedStakedIota and we
    // do not enable DnD on the filtered list — the parent's handleDnd would
    // otherwise replace `account.objects` with only the visible (filtered)
    // subset, silently dropping the rest.
    let stakeOnlyObjects = $derived(visibleObjects.filter(isStakeObject));
    let stakeOnlyTimelocked = $derived(visibleTimelocked.filter(isStakeObject));

    // ─── Stake-from-liquid controls ──────────────────────────────────────────
    /** Liquid (non-timelocked) IOTA available to stake on this account. */
    let liquidIotaNano = $derived.by(() => {
        let total = 0n;
        for (const obj of account.objects) total += objectIotaCoinAmount(obj);
        return total;
    });
    /** Reserve a small amount for unstake gas. 0.1 IOTA chosen to match the
     *  user's stated rule of thumb — enough headroom for a follow-up
     *  unstake transaction without locking the entire balance. */
    const STAKE_GAS_RESERVE_NANO = 100_000_000n;
    /** Threshold below which the stake control is hidden — staking dust is
     *  rarely worth the gas. Matches the "more than one IOTA" UX rule. */
    const STAKE_MIN_LIQUID_NANO = 1_000_000_000n;
    let canStake = $derived(
        stakingMode && !!onRequestStake && liquidIotaNano > STAKE_MIN_LIQUID_NANO,
    );
    let defaultStakeAmount = $derived(
        liquidIotaNano > STAKE_GAS_RESERVE_NANO ? liquidIotaNano - STAKE_GAS_RESERVE_NANO : 0n,
    );
    /** User-editable stake amount, kept in IOTA units (not nano) so the input
     *  shows decimals naturally. Re-syncs to the default whenever the liquid
     *  balance changes (e.g. after a Sync). */
    let stakeAmountIota = $state('');
    let lastSyncedDefault = 0n;
    $effect(() => {
        if (defaultStakeAmount !== lastSyncedDefault) {
            lastSyncedDefault = defaultStakeAmount;
            stakeAmountIota = nanoToIota(defaultStakeAmount.toString());
        }
    });

    let stakeAmountNano = $derived.by<bigint | null>(() => {
        const trimmed = stakeAmountIota.trim();
        if (!trimmed) return null;
        try {
            return BigInt(iotaToNano(trimmed));
        } catch {
            return null;
        }
    });
    let stakeAmountValid = $derived(
        stakeAmountNano !== null && stakeAmountNano > 0n && stakeAmountNano <= liquidIotaNano,
    );

    function handleStakeClick() {
        if (!onRequestStake || !stakeAmountValid || stakeAmountNano === null) return;
        onRequestStake(account.address, stakeAmountNano);
    }
</script>

<div class="account-card">
    <div class="account-header">
        <div style="display: flex; flex-direction: column;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span class="account-title" title={account.address}>
                    {displayLabel}
                </span>
                <button
                    style="font-size: 0.7rem; padding: 0.1rem 0.3rem; width: fit-content; background: var(--secondary-color); border-radius: 3px;"
                    onclick={() => navigator.clipboard.writeText(account.address)}
                >
                    Copy Address
                </button>
            </div>
            <div class="account-buttons" style="display: flex; gap: 0.5rem; margin-top: 0.2rem;">
                <button
                    style="font-size: 0.7rem; padding: 0.1rem 0.3rem; width: fit-content; border-radius: 3px;"
                    onclick={onToggleCollapse}
                >
                    {account.isCollapsed ? '▶ Expand' : '▼ Collapse'} ({isFiltered
                        ? `${visibleCount}/${objectCount}`
                        : objectCount})
                </button>
            </div>
        </div>
        <div
            style="text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 0.2rem;"
        >
            <div style="display: flex; gap: 0.3rem; flex-wrap: wrap; justify-content: flex-end;">
                <button
                    class="header-btn"
                    onclick={onSolo}
                    title="Show only this account; hide every other card."
                >
                    Solo
                </button>
                <button
                    class="header-btn"
                    onclick={onHide}
                    title="Hide this card. Use 'Show hidden' in the toolbar to bring it back."
                >
                    Hide
                </button>
                <button class="header-btn danger" onclick={onRemove}>Remove</button>
            </div>
            <div class="account-balance">
                {formatIotaAmount(totalBalance, compactAmounts)}
                <span style="font-size: 0.8em; color: var(--text-muted);">IOTA</span>
            </div>
        </div>
    </div>

    {#if canStake}
        <div class="stake-row">
            <span class="stake-label" title="Liquid IOTA available to stake">
                Liquid: {formatIotaAmount(liquidIotaNano, compactAmounts)} IOTA
            </span>
            <input
                class="stake-input"
                type="text"
                inputmode="decimal"
                bind:value={stakeAmountIota}
                aria-label="Stake amount in IOTA"
            />
            <button
                class="stake-btn"
                onclick={handleStakeClick}
                disabled={!stakeAmountValid}
                title={!stakeAmountValid
                    ? 'Enter an amount > 0 and ≤ liquid balance.'
                    : 'Open net-return chart to pick a validator and confirm.'}
            >
                Stake{stakeAmountValid && stakeAmountNano !== null
                    ? ` ${formatIotaAmount(stakeAmountNano, compactAmounts)} IOTA`
                    : ''}
            </button>
        </div>
    {/if}

    {#if !account.isCollapsed}
        {#if stakingMode}
            <div class="object-list">
                {#each stakeOnlyObjects as item (item.id)}
                    <ObjectItem
                        {item}
                        accountAddress={account.address}
                        {getAccountDisplayName}
                        variant="standard"
                        stakingMetric={stakingMetrics?.get(item.id)}
                        onOptimize={onOptimizeStake && stakingMetrics?.get(item.id)
                            ? () => onOptimizeStake!(item.id)
                            : undefined}
                        {currentPrice}
                        {selectedCurrency}
                        {compactAmounts}
                    />
                {/each}

                {#if stakeOnlyObjects.length === 0 && stakeOnlyTimelocked.length === 0}
                    <div
                        style="text-align: center; color: var(--text-muted); padding: 1rem; font-size: 0.8rem;"
                    >
                        No stakes
                    </div>
                {/if}

                {#if stakeOnlyTimelocked.length !== 0}
                    <div
                        style="margin-top: 0.5rem; border-top: 1px solid var(--border-color); padding-top: 0.5rem;"
                    >
                        <div
                            style="font-size: 0.8rem; color: #f87171; margin-bottom: 0.25rem;"
                            title="Timelocked stakes are intentionally excluded from optimization. Unlock them first to switch validator."
                        >
                            Timelocked (no optimization)
                        </div>
                        {#each stakeOnlyTimelocked as item (item.id)}
                            <ObjectItem
                                {item}
                                accountAddress={account.address}
                                {getAccountDisplayName}
                                variant="timelocked"
                                {compactAmounts}
                            />
                        {/each}
                    </div>
                {/if}
            </div>
        {:else if isFiltered}
            <!-- Filter active: render the filtered subset without DnD so a
                 reorder doesn't drop the hidden objects from `account.objects`. -->
            <div class="object-list">
                {#each visibleObjects as item (item.id)}
                    <ObjectItem
                        {item}
                        accountAddress={account.address}
                        {getAccountDisplayName}
                        variant="standard"
                        {compactAmounts}
                    />
                {/each}

                {#if visibleObjects.length === 0 && visibleTimelocked.length === 0}
                    <div
                        style="text-align: center; color: var(--text-muted); padding: 1rem; font-size: 0.8rem;"
                    >
                        No objects match filter
                    </div>
                {/if}

                {#if visibleTimelocked.length !== 0}
                    <div
                        style="margin-top: 0.5rem; border-top: 1px solid var(--border-color); padding-top: 0.5rem;"
                    >
                        <div style="font-size: 0.8rem; color: #f87171; margin-bottom: 0.25rem;">
                            Timelocked
                        </div>
                        {#each visibleTimelocked as item (item.id)}
                            <ObjectItem
                                {item}
                                accountAddress={account.address}
                                {getAccountDisplayName}
                                variant="timelocked"
                                {compactAmounts}
                            />
                        {/each}
                    </div>
                {/if}
            </div>
        {:else}
            <div
                use:dragHandleZone={{ items: account.objects, flipDurationMs: 200 }}
                onconsider={onDnd}
                onfinalize={onDnd}
                class="object-list"
            >
                {#each account.objects as item (item.id)}
                    <ObjectItem
                        {item}
                        accountAddress={account.address}
                        {getAccountDisplayName}
                        variant="standard"
                        {compactAmounts}
                    />
                {/each}

                {#if account.objects.length === 0 && account.timelockedObjects.length === 0}
                    <div
                        style="text-align: center; color: var(--text-muted); padding: 1rem; font-size: 0.8rem;"
                    >
                        No objects
                    </div>
                {/if}

                {#if account.timelockedObjects.length !== 0}
                    <div
                        style="margin-top: 0.5rem; border-top: 1px solid var(--border-color); padding-top: 0.5rem;"
                    >
                        <div style="font-size: 0.8rem; color: #f87171; margin-bottom: 0.25rem;">
                            Timelocked
                        </div>
                        {#each account.timelockedObjects as item (item.id)}
                            <ObjectItem
                                {item}
                                accountAddress={account.address}
                                {getAccountDisplayName}
                                variant="timelocked"
                                {compactAmounts}
                            />
                        {/each}
                    </div>
                {/if}
            </div>
        {/if}
    {/if}
</div>

<style>
    .header-btn {
        font-size: 0.7rem;
        padding: 0.1rem 0.3rem;
        width: fit-content;
        border-radius: 3px;
    }

    button.danger {
        background: rgba(220, 53, 69, 0.2);
        border-color: rgba(220, 53, 69, 0.5);
        color: #ffadad;
    }

    button.danger:hover {
        background: rgba(220, 53, 69, 0.4);
    }

    .account-card {
        background: var(--background-card);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .account-header {
        background: rgba(255, 255, 255, 0.03);
        padding: 0.5rem 0.75rem;
        border-bottom: 1px solid var(--border-color);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .account-title {
        font-weight: 600;
        font-size: 0.95rem;
    }

    .account-buttons {
        display: flex;
        gap: 0.5rem;
    }

    .account-balance {
        font-family: monospace;
        color: #4ade80;
    }

    .object-list {
        flex-grow: 1;
        overflow-y: auto;
        max-height: 300px;
        padding: 0.5rem;
        background: rgba(0, 0, 0, 0.1);
    }

    .stake-row {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.4rem 0.75rem;
        background: rgba(74, 222, 128, 0.05);
        border-bottom: 1px solid var(--border-color);
        font-size: 0.75rem;
        flex-wrap: wrap;
    }

    .stake-label {
        color: var(--text-muted);
        font-family: monospace;
    }

    .stake-input {
        width: 8rem;
        font-family: monospace;
        font-size: 0.75rem;
        padding: 0.15rem 0.3rem;
        border-radius: 3px;
        border: 1px solid var(--border-color);
        background: var(--background-card);
        color: inherit;
    }

    .stake-btn {
        font-size: 0.75rem;
        padding: 0.2rem 0.5rem;
        border-radius: 3px;
        background: rgba(74, 222, 128, 0.18);
        border: 1px solid rgba(74, 222, 128, 0.45);
        color: #bbf7d0;
        cursor: pointer;
    }

    .stake-btn:hover:not(:disabled) {
        background: rgba(74, 222, 128, 0.3);
    }

    .stake-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
</style>

<script lang="ts">
    import { dragHandleZone, type DndEvent } from 'svelte-dnd-action';

    import { formatNumberWithUnderscores, nanoToIota } from '../../utils/iota-nano-conversion';
    import {
        accountTotalBalance,
        isStakeObject,
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
        onToggleCollapse: () => void;
        /** Per-stake-object metric block, keyed by stake object id. Only set in
         *  staking mode and only for objects whose pool is known. */
        stakingMetrics?: Map<string, StakingMetricInfo>;
        /** Callback when the user clicks Optimize/Compare on a stake. */
        onOptimizeStake?: (stakeId: string) => void;
        /** Forwarded to per-stake badges for IOTA→fiat conversion. */
        currentPrice?: FiatPrice;
        selectedCurrency?: Currency;
    }

    let {
        account,
        stakingMode,
        getAccountDisplayName,
        onDnd,
        onRemove,
        onToggleCollapse,
        stakingMetrics,
        onOptimizeStake,
        currentPrice = null,
        selectedCurrency = 'USD',
    }: Props = $props();

    let displayLabel = $derived(
        account.label || account.address.slice(0, 6) + '...' + account.address.slice(-4),
    );
    let totalBalance = $derived(accountTotalBalance(account));
    let objectCount = $derived(account.objects.length + account.timelockedObjects.length);

    // In staking mode we show only StakedIota / TimelockedStakedIota and we
    // do not enable DnD on the filtered list — the parent's handleDnd would
    // otherwise replace `account.objects` with only the visible (filtered)
    // subset, silently dropping the rest.
    let stakeOnlyObjects = $derived(account.objects.filter(isStakeObject));
    let stakeOnlyTimelocked = $derived(account.timelockedObjects.filter(isStakeObject));
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
                    {account.isCollapsed ? '▶ Expand' : '▼ Collapse'} ({objectCount})
                </button>
                <!-- TODO(staking): add per-account staking action buttons here
                     (e.g. "Stake to validator…", "Unstake all"). The validator
                     picker comes from ../stake/validator-service.ts. -->
            </div>
        </div>
        <div
            style="text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 0.2rem;"
        >
            <button
                class="danger"
                style="font-size: 0.7rem; padding: 0.1rem 0.3rem; width: fit-content; border-radius: 3px;"
                onclick={onRemove}
            >
                Remove
            </button>
            <div class="account-balance">
                {formatNumberWithUnderscores(nanoToIota(totalBalance.toString()))}
                <span style="font-size: 0.8em; color: var(--text-muted);">IOTA</span>
            </div>
        </div>
    </div>

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
                            />
                        {/each}
                    </div>
                {/if}
            </div>
        {/if}
    {/if}
</div>

<style>
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
</style>

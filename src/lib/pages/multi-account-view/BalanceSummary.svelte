<script lang="ts">
    import { nanoToIota } from '../../utils/iota-nano-conversion';
    import {
        accountIotaCoins,
        accountStaked,
        accountTotalBalance,
        formatIotaAmount,
        formatIotaCompact,
        sumAccounts,
        type Currency,
        type FiatPrice,
    } from './balance-utils';
    import { fetchCurrentPrice, type ExtendedAccount } from './multi-account-service';

    interface Props {
        accounts: ExtendedAccount[];
        selectedCurrency: Currency;
        currentPrice: FiatPrice;
        compactAmounts: boolean;
    }

    let {
        accounts,
        selectedCurrency = $bindable(),
        currentPrice = $bindable(),
        compactAmounts = $bindable(),
    }: Props = $props();

    let totalBalance = $derived(sumAccounts(accounts, accountTotalBalance));
    let totalIotaCoins = $derived(sumAccounts(accounts, accountIotaCoins));
    let totalStaked = $derived(sumAccounts(accounts, accountStaked));
    let totalRewards = $derived(sumAccounts(accounts, (a) => a.stakingRewards));

    function fiat(amountNano: bigint): string {
        if (!currentPrice) return '-';
        const iota = parseFloat(nanoToIota(amountNano.toString()));
        const rate = selectedCurrency === 'USD' ? currentPrice.usd : currentPrice.eur;
        return (iota * rate).toFixed(2);
    }
</script>

<details class="summary-section" open>
    <summary>
        <span class="chevron" aria-hidden="true">▶</span>
        <span class="title">Balance Breakdown</span>
        <span class="subtitle">
            Total:
            {formatIotaCompact(totalBalance)} IOTA{currentPrice
                ? ` ≈ ${fiat(totalBalance)} ${selectedCurrency}`
                : ''}
        </span>
    </summary>

    <div class="price-controls">
        <label
            class="compact-toggle"
            title="Round IOTA amounts to 2 decimals instead of showing the full nano tail."
        >
            <input type="checkbox" bind:checked={compactAmounts} />
            <span>Compact amounts</span>
        </label>
        <select bind:value={selectedCurrency}>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
        </select>
        <button onclick={() => fetchCurrentPrice().then((price) => (currentPrice = price))}>
            Fetch Price
        </button>
    </div>

    <!-- TODO(staking): when stakingMode is on, render a timeframe selector
         (7d / 30d / 90d / all) and per-validator metrics here — realized
         rewards in window, gross APR, net APR (after commission), and a
         "best alternative validator" suggestion. These should be derived from
         the cached exchange rates exported by ../staking-rewards. -->

    <div class="table-wrapper">
        <table class="summary-table">
            <thead>
                <tr>
                    <th>Category</th>
                    <th>Amount (IOTA)</th>
                    <th>Value ({selectedCurrency})</th>
                </tr>
            </thead>
            <tbody>
                <tr class="total-row" style="background: rgba(16, 185, 129, 0.1);">
                    <td><strong>Total</strong></td>
                    <td>
                        <strong>{formatIotaAmount(totalBalance, compactAmounts)}</strong>
                    </td>
                    <td><strong>{fiat(totalBalance)}</strong></td>
                </tr>
                <tr>
                    <td>IOTA Coins</td>
                    <td>{formatIotaAmount(totalIotaCoins, compactAmounts)}</td>
                    <td>{fiat(totalIotaCoins)}</td>
                </tr>
                <tr>
                    <td>Staked</td>
                    <td>{formatIotaAmount(totalStaked, compactAmounts)}</td>
                    <td>{fiat(totalStaked)}</td>
                </tr>
                <tr>
                    <td>Staking Rewards</td>
                    <td>{formatIotaAmount(totalRewards, compactAmounts)}</td>
                    <td>{fiat(totalRewards)}</td>
                </tr>
                <!-- TODO(staking): in stakingMode, append additional rows here:
                     "Rewards in window", "Avg APR (gross)", "Avg APR (net of
                     commission)" — and a per-validator breakdown (or a separate
                     sub-table below). -->
            </tbody>
        </table>
    </div>
</details>

<style>
    .summary-section {
        margin: 0.5rem 0;
        background: var(--background-card);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 0.5rem 0.75rem;
    }

    .summary-section summary {
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        list-style: none;
        user-select: none;
    }

    /* Hide the default disclosure marker so our chevron is the only one. */
    .summary-section summary::-webkit-details-marker {
        display: none;
    }
    .summary-section summary::marker {
        content: '';
    }

    .chevron {
        display: inline-block;
        width: 1em;
        font-size: 0.7rem;
        color: var(--text-muted);
        transition: transform 0.15s ease;
        transform: rotate(0deg);
    }

    .summary-section[open] > summary .chevron {
        transform: rotate(90deg);
    }

    .summary-section summary:hover .chevron {
        color: var(--text-color);
    }

    .title {
        font-weight: 600;
        font-size: 0.95rem;
    }

    .subtitle {
        font-size: 0.8rem;
        color: var(--text-muted);
    }

    .price-controls {
        display: flex;
        justify-content: flex-end;
        gap: 0.5rem;
        align-items: center;
        margin-top: 0.5rem;
    }

    .compact-toggle {
        display: inline-flex;
        align-items: center;
        gap: 0.3rem;
        font-size: 0.8rem;
        color: var(--text-muted);
        cursor: pointer;
        user-select: none;
    }

    .compact-toggle input {
        accent-color: #6366f1;
    }

    .price-controls select {
        padding: 0.25rem;
        background-color: #232324;
        color: #ffffff;
        border: 1px solid #535353;
        border-radius: 4px;
        font-size: 0.85rem;
    }

    .price-controls button {
        padding: 0.25rem 0.5rem;
        background-color: rgb(36, 47, 77);
        color: #ffffff;
        border: 1px solid #535353;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.85rem;
    }

    .summary-table {
        margin: 0.5rem 0 0 0;
        width: 100%;
        border-collapse: collapse;
        font-size: 0.9rem;
    }

    .summary-table th,
    .summary-table td {
        padding: 0.25rem 0.5rem;
        text-align: right;
        border-bottom: 1px solid var(--border-color);
    }

    .summary-table th:first-child,
    .summary-table td:first-child {
        text-align: left;
    }

    .summary-table td:not(:first-child) {
        font-family: monospace;
        font-variant-numeric: tabular-nums;
    }

    .summary-table th {
        color: var(--text-muted);
        font-weight: 600;
    }
</style>

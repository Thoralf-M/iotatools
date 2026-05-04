<script lang="ts">
    import { formatNumberWithUnderscores, nanoToIota } from '../../utils/iota-nano-conversion';
    import {
        accountIotaCoins,
        accountStaked,
        accountTotalBalance,
        sumAccounts,
        type Currency,
        type FiatPrice,
    } from './balance-utils';
    import { fetchCurrentPrice, type ExtendedAccount } from './multi-account-service';

    interface Props {
        accounts: ExtendedAccount[];
        stakingMode: boolean;
        selectedCurrency: Currency;
        currentPrice: FiatPrice;
    }

    let {
        accounts,
        stakingMode,
        selectedCurrency = $bindable(),
        currentPrice = $bindable(),
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

<div class="summary-section">
    <div class="summary-header">
        <h3>Balance Breakdown</h3>
        <div class="price-controls">
            <select bind:value={selectedCurrency}>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
            </select>
            <button onclick={() => fetchCurrentPrice().then((price) => (currentPrice = price))}>
                Fetch Price
            </button>
        </div>
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
                {#if !stakingMode}
                    <tr class="total-row" style="background: rgba(16, 185, 129, 0.1);">
                        <td><strong>Total</strong></td>
                        <td>
                            <strong
                                >{formatNumberWithUnderscores(
                                    nanoToIota(totalBalance.toString()),
                                )}</strong
                            >
                        </td>
                        <td><strong>{fiat(totalBalance)}</strong></td>
                    </tr>
                    <tr>
                        <td>IOTA Coins</td>
                        <td>{formatNumberWithUnderscores(nanoToIota(totalIotaCoins.toString()))}</td
                        >
                        <td>{fiat(totalIotaCoins)}</td>
                    </tr>
                {/if}
                <tr>
                    <td>Staked</td>
                    <td>{formatNumberWithUnderscores(nanoToIota(totalStaked.toString()))}</td>
                    <td>{fiat(totalStaked)}</td>
                </tr>
                <tr>
                    <td>Staking Rewards</td>
                    <td>{formatNumberWithUnderscores(nanoToIota(totalRewards.toString()))}</td>
                    <td>{fiat(totalRewards)}</td>
                </tr>
                <!-- TODO(staking): in stakingMode, append additional rows here:
                     "Rewards in window", "Avg APR (gross)", "Avg APR (net of
                     commission)" — and a per-validator breakdown (or a separate
                     sub-table below). -->
            </tbody>
        </table>
    </div>
</div>

<style>
    .summary-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
    }

    .summary-header h3 {
        margin: 0;
        font-size: 1rem;
        color: var(--text-muted);
    }

    .price-controls {
        display: flex;
        gap: 0.5rem;
        align-items: center;
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
        margin-left: 0;
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

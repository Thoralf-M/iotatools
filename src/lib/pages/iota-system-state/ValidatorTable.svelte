<script lang="ts">
    import { nanoToIotaFormatted } from '../../utils/iota-nano-conversion';
    import type { ValidatorTableRow } from './system-state-service';

    let {
        rows,
        variant = 'default',
    }: {
        rows: ValidatorTableRow[];
        variant?: 'default' | 'active' | 'candidate' | 'inactive';
    } = $props();

    let showNextEpochStake = $derived(variant !== 'inactive');
    let showRewardsPool = $derived(variant !== 'candidate');
    let showActivationEpoch = $derived(variant !== 'candidate');
    let showDeactivationEpoch = $derived(variant !== 'active' && variant !== 'candidate');
    let showEffectiveCommission = $derived(rows.length > 0 && rows[0].effectiveCommission != null);

    type SortKey = keyof ValidatorTableRow;
    let defaultSortKey = $derived<SortKey | null>(
        variant === 'inactive' ? null : 'stakingPoolIotaBalance',
    );
    let defaultSortAsc = $derived(variant === 'inactive' ? true : false);
    let sortKey = $state<SortKey | null>(undefined as any);
    let sortAsc = $state(true);
    let initialized = $state(false);

    $effect(() => {
        // Reset sort when variant or rows change
        void variant;
        void rows;
        sortKey = defaultSortKey;
        sortAsc = defaultSortAsc;
        initialized = true;
    });

    const bigIntFields = new Set<SortKey>([
        'commissionRate',
        'stakingPoolIotaBalance',
        'nextEpochStake',
        'stakingPoolActivationEpoch',
        'stakingPoolDeactivationEpoch',
        'rewardsPool',
    ]);

    const floatFields = new Set<SortKey>(['effectiveCommission']);

    function toggleSort(key: SortKey) {
        if (sortKey === key) {
            sortAsc = !sortAsc;
        } else {
            sortKey = key;
            sortAsc = true;
        }
    }

    let sortedRows = $derived.by(() => {
        if (!sortKey) return rows;
        const key = sortKey;
        const asc = sortAsc;
        const isBigInt = bigIntFields.has(key);
        const isFloat = floatFields.has(key);
        return [...rows].sort((a, b) => {
            const aVal = a[key] ?? '';
            const bVal = b[key] ?? '';
            let cmp: number;
            if (isBigInt) {
                cmp = Number(BigInt(String(aVal) || '0') - BigInt(String(bVal) || '0'));
            } else if (isFloat) {
                cmp = parseFloat(String(aVal) || '0') - parseFloat(String(bVal) || '0');
            } else {
                cmp = String(aVal).localeCompare(String(bVal));
            }
            return asc ? cmp : -cmp;
        });
    });

    function sortIndicator(key: SortKey): string {
        if (sortKey !== key) return '';
        return sortAsc ? ' \u25B2' : ' \u25BC';
    }

    function formatCommission(rate: string): string {
        return (parseInt(rate) / 100).toFixed(2) + '%';
    }
</script>

<div class="table-wrap">
    <table>
        <thead>
            <tr>
                <th class="sortable" onclick={() => toggleSort('name')}>
                    Name{sortIndicator('name')}
                </th>
                <th class="sortable right" onclick={() => toggleSort('commissionRate')}>
                    Commission{sortIndicator('commissionRate')}
                </th>
                {#if showEffectiveCommission}
                    <th class="sortable right" onclick={() => toggleSort('effectiveCommission')}>
                        Eff. Commission (<a
                            href="https://github.com/iotaledger/IIPs/blob/main/iips/IIP-0008/IIP-0008.md"
                            target="_blank"
                            rel="noopener noreferrer"
                            onclick={(e) => e.stopPropagation()}>IIP-8</a
                        >){sortIndicator('effectiveCommission')}
                    </th>
                {/if}
                <th class="sortable right" onclick={() => toggleSort('stakingPoolIotaBalance')}>
                    Staked (IOTA){sortIndicator('stakingPoolIotaBalance')}
                </th>
                {#if showNextEpochStake}
                    <th class="sortable right" onclick={() => toggleSort('nextEpochStake')}>
                        Next Epoch Stake{sortIndicator('nextEpochStake')}
                    </th>
                {/if}
                {#if showActivationEpoch}
                    <th
                        class="sortable right"
                        onclick={() => toggleSort('stakingPoolActivationEpoch')}
                    >
                        Activation Epoch{sortIndicator('stakingPoolActivationEpoch')}
                    </th>
                {/if}
                {#if showDeactivationEpoch}
                    <th
                        class="sortable right"
                        onclick={() => toggleSort('stakingPoolDeactivationEpoch')}
                    >
                        Deactivation Epoch{sortIndicator('stakingPoolDeactivationEpoch')}
                    </th>
                {/if}
                {#if showRewardsPool}
                    <th class="sortable right" onclick={() => toggleSort('rewardsPool')}>
                        Rewards Pool{sortIndicator('rewardsPool')}
                    </th>
                {/if}
                <th class="sortable" onclick={() => toggleSort('address')}>
                    Address{sortIndicator('address')}
                </th>
                <th>Staking Pool ID</th>
            </tr>
        </thead>
        <tbody>
            {#each sortedRows as row}
                <tr>
                    <td class="name">{row.name}</td>
                    <td class="right">{formatCommission(row.commissionRate)}</td>
                    {#if showEffectiveCommission}
                        <td class="right">{row.effectiveCommission}%</td>
                    {/if}
                    <td class="mono right">{nanoToIotaFormatted(row.stakingPoolIotaBalance)}</td>
                    {#if showNextEpochStake}
                        <td class="mono right">{nanoToIotaFormatted(row.nextEpochStake)}</td>
                    {/if}
                    {#if showActivationEpoch}
                        <td class="right">{row.stakingPoolActivationEpoch ?? '-'}</td>
                    {/if}
                    {#if showDeactivationEpoch}
                        <td class="right">{row.stakingPoolDeactivationEpoch ?? '-'}</td>
                    {/if}
                    {#if showRewardsPool}
                        <td class="mono right">{nanoToIotaFormatted(row.rewardsPool)}</td>
                    {/if}
                    <td class="mono">{row.address}</td>
                    <td class="mono">{row.stakingPoolId}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<style>
    .table-wrap {
        overflow-x: auto;
        margin-top: 0.5rem;
    }

    table {
        width: 100%;
        font-size: 0.82rem;
        border-collapse: collapse;
    }

    th {
        position: sticky;
        top: 0;
        white-space: nowrap;
        padding: 0.5rem 0.75rem;
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.03em;
    }

    th.sortable {
        cursor: pointer;
        user-select: none;
    }

    th.sortable:hover {
        color: rgba(255, 255, 255, 0.9);
    }

    th a {
        color: #93c5fd;
    }

    th a:hover {
        color: #bfdbfe;
    }

    td {
        padding: 0.4rem 0.75rem;
        white-space: nowrap;
    }

    .name {
        font-weight: 500;
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .mono {
        font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
        font-size: 0.78rem;
    }

    .right {
        text-align: right;
    }
</style>

<script lang="ts">
    import JsonToggleView from '../../components/JsonToggleView.svelte';
    import { getClient } from '../../utils/client';
    import { nanoToIotaFormatted } from '../../utils/iota-nano-conversion';
    import type { StakeInfo, ValidatorTableRow } from './system-state-service';
    import {
        fetchCandidateValidators,
        fetchInactiveValidators,
        fetchLatestSystemState,
        fetchPendingValidators,
    } from './system-state-service';
    import ValidatorTable from './ValidatorTable.svelte';

    let value = {};
    let apiVersion = '';
    let stakeInfo: StakeInfo = {};
    let showAllValidatorData = false;
    let validatorRows: ValidatorTableRow[] = [];
    let viewMode: 'table' | 'json' = 'table';
    let tableVariant: 'default' | 'candidate' | 'inactive' = 'default';

    // System state structured data
    let baseFields: Record<string, any> = {};
    let committeeRows: ValidatorTableRow[] = [];
    let activeValidatorRows: ValidatorTableRow[] = [];
    let hasSystemState = false;

    const nanoFields = new Set([
        'iotaTotalSupply',
        'storageFundTotalObjectStorageRebates',
        'storageFundNonRefundableBalance',
        'totalStake',
        'minValidatorJoiningStake',
        'validatorLowStakeThreshold',
        'validatorVeryLowStakeThreshold',
        'safeModeStorageCharges',
        'safeModeComputationCharges',
        'safeModeComputationChargesBurned',
        'safeModeStorageRebates',
        'safeModeNonRefundableStorageFee',
    ]);

    function formatFieldValue(key: string, val: any): string {
        if (val === null || val === undefined) return '-';
        if (Array.isArray(val)) return val.length === 0 ? '[]' : JSON.stringify(val);
        const str = String(val);
        if (nanoFields.has(key) && /^[\d_]+$/.test(str)) {
            return nanoToIotaFormatted(str.replace(/_/g, '')) + ' IOTA';
        }
        return str;
    }

    function stripUnderscores(val: string | number | undefined): string {
        if (val === undefined || val === null) return '0';
        return String(val).replace(/_/g, '');
    }

    function percentOfSupply(val: string | number | undefined, supply: string | undefined): string {
        const supplyRaw = stripUnderscores(supply);
        const valRaw = stripUnderscores(val);
        if (supplyRaw === '0' || valRaw === '0') return '';
        // Use BigInt scaled by 10000 for 2 decimal places
        const pct = (BigInt(valRaw) * 10000n) / BigInt(supplyRaw);
        return (Number(pct) / 100).toFixed(2) + '%';
    }

    const stakeInfoLabels: Record<string, string> = {
        totalSupply: 'Total Supply',
        totalStake: 'Total Stake',
        pendingStake: 'Pending Stake',
        nextEpochStake: 'Next Epoch Stake',
        candidateValidatorsStake: 'Candidate Validators Stake',
        pendingValidatorsStake: 'Pending Validators Stake',
    };

    const stakeFieldsWithPct = new Set([
        'totalStake',
        'pendingStake',
        'nextEpochStake',
        'candidateValidatorsStake',
        'pendingValidatorsStake',
    ]);

    const getLatestSystemState = async () => {
        try {
            const client = getClient();
            const result = await fetchLatestSystemState(client);
            value = result.formattedSystemState;
            stakeInfo = result.stakeInfo;
            apiVersion = result.apiVersion;
            baseFields = result.baseFields;
            committeeRows = result.committeeRows;
            activeValidatorRows = result.activeValidatorRows;
            hasSystemState = true;
            validatorRows = [];
            tableVariant = 'default';
        } catch (err: any) {
            value = err.toString();
            validatorRows = [];
            hasSystemState = false;
            tableVariant = 'default';
            console.error(err);
        }
    };

    const getCandidateValidators = async () => {
        try {
            const client = getClient();
            const {
                formattedValidators,
                stakeInfo: newStakeInfo,
                validatorRows: rows,
            } = await fetchCandidateValidators(client, showAllValidatorData);
            value = formattedValidators;
            stakeInfo = newStakeInfo;
            validatorRows = rows;
            tableVariant = 'candidate';
            hasSystemState = false;
        } catch (err: any) {
            value = err.toString();
            validatorRows = [];
            hasSystemState = false;
            tableVariant = 'default';
            console.error(err);
        }
    };

    const getPendingValidators = async () => {
        try {
            const client = getClient();
            const {
                formattedValidators,
                stakeInfo: newStakeInfo,
                validatorRows: rows,
            } = await fetchPendingValidators(client, showAllValidatorData);
            value = formattedValidators;
            stakeInfo = newStakeInfo;
            validatorRows = rows;
            tableVariant = 'candidate';
            hasSystemState = false;
        } catch (err: any) {
            value = err.toString();
            validatorRows = [];
            hasSystemState = false;
            tableVariant = 'default';
            console.error(err);
        }
    };

    const getInactiveValidators = async () => {
        try {
            const client = getClient();
            const { formattedValidators, validatorRows: rows } = await fetchInactiveValidators(
                client,
                showAllValidatorData,
            );
            value = formattedValidators;
            validatorRows = rows;
            tableVariant = 'inactive';
            hasSystemState = false;
        } catch (err: any) {
            value = err.toString();
            validatorRows = [];
            hasSystemState = false;
            tableVariant = 'default';
            console.error(err);
        }
    };
</script>

<main>
    <button on:click={() => getLatestSystemState()}> get latest IOTA system state </button>
    <button on:click={() => getCandidateValidators()}> candidate validators </button>
    <button on:click={() => getPendingValidators()}> pending validators </button>
    <button on:click={() => getInactiveValidators()}> inactive validators </button>
    show full data (set before requesting):
    <select bind:value={showAllValidatorData}>
        <option value={true}>{true}</option>
        <option value={false}>{false}</option>
    </select>

    {#if apiVersion}
        <div>
            API Version: {apiVersion}
        </div>
    {/if}

    {#if hasSystemState || validatorRows.length > 0}
        <div class="view-toggle">
            <button class:active={viewMode === 'table'} on:click={() => (viewMode = 'table')}>
                Table
            </button>
            <button class:active={viewMode === 'json'} on:click={() => (viewMode = 'json')}>
                JSON
            </button>
        </div>
    {/if}

    {#if viewMode === 'json' || (!hasSystemState && validatorRows.length === 0)}
        <JsonToggleView {value} />
    {:else if hasSystemState}
        <div class="system-state-tables">
            <details class="section" open>
                <summary><h3>System State</h3></summary>
                <div class="kv-table-wrap">
                    <table class="kv-table">
                        <tbody>
                            {#each Object.entries(baseFields) as [key, val]}
                                <tr>
                                    <td class="kv-key">{key}</td>
                                    <td class="kv-val mono">{formatFieldValue(key, val)}</td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            </details>

            {#if committeeRows.length > 0}
                <details class="section" open>
                    <summary>
                        <h3>Committee Members ({committeeRows.length})</h3>
                    </summary>
                    <ValidatorTable rows={committeeRows} variant="active" />
                </details>
            {/if}

            {#if activeValidatorRows.length > 0}
                <details class="section" open>
                    <summary>
                        <h3>Other Active Validators ({activeValidatorRows.length})</h3>
                    </summary>
                    <ValidatorTable rows={activeValidatorRows} variant="active" />
                </details>
            {/if}
        </div>
    {:else if validatorRows.length > 0}
        <ValidatorTable rows={validatorRows} variant={tableVariant} />
    {/if}

    {#if stakeInfo.totalSupply && stakeInfo.totalSupply !== '0'}
        <div class="stake-info-wrap">
            <table class="kv-table">
                <tbody>
                    {#each Object.entries(stakeInfo) as [key, val]}
                        <tr>
                            <td class="kv-key">{stakeInfoLabels[key] || key}</td>
                            <td class="kv-val mono">
                                {nanoToIotaFormatted(stripUnderscores(val))} IOTA
                            </td>
                            <td class="kv-pct mono">
                                {stakeFieldsWithPct.has(key)
                                    ? percentOfSupply(val, stakeInfo.totalSupply)
                                    : ''}
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {/if}
</main>

<style>
    button {
        margin: 0.5rem;
    }

    .view-toggle {
        display: inline-flex;
        gap: 0;
        margin-top: 0.5rem;
    }

    .view-toggle button {
        margin: 0;
        border-radius: 0;
        padding: 0.3rem 0.8rem;
        font-size: 0.8rem;
        border: 1px solid var(--border-color);
    }

    .view-toggle button:first-child {
        border-radius: 6px 0 0 6px;
    }

    .view-toggle button:last-child {
        border-radius: 0 6px 6px 0;
    }

    .view-toggle button.active {
        background: var(--primary-color);
        color: white;
    }

    .system-state-tables {
        text-align: left;
    }

    .section {
        margin-top: 1rem;
    }

    .section summary {
        cursor: pointer;
        list-style: none;
        user-select: none;
    }

    .section summary::-webkit-details-marker {
        display: none;
    }

    .section summary h3::before {
        content: '\25B6';
        display: inline-block;
        margin-right: 0.4rem;
        font-size: 0.7rem;
        transition: transform 0.15s;
    }

    .section[open] > summary h3::before {
        transform: rotate(90deg);
    }

    .section h3 {
        display: inline;
        font-size: 1rem;
        margin-bottom: 0.25rem;
        color: var(--text-muted);
    }

    .kv-table-wrap {
        overflow-x: auto;
    }

    .kv-table {
        font-size: 0.82rem;
        border-collapse: collapse;
        width: auto;
    }

    .kv-table td {
        padding: 0.2rem 0.75rem;
    }

    .kv-key {
        color: var(--text-muted);
        white-space: nowrap;
        font-weight: 500;
    }

    .kv-val {
        word-break: break-all;
    }

    .kv-pct {
        color: var(--text-muted);
        white-space: nowrap;
    }

    .stake-info-wrap {
        text-align: left;
        margin-top: 1rem;
    }

    .mono {
        font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
        font-size: 0.78rem;
    }
</style>

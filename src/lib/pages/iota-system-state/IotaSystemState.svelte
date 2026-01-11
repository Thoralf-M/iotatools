<script lang="ts">
    import JsonToggleView from '../../components/JsonToggleView.svelte';
    import { getClient } from '../../utils/client';
    import type { StakeInfo } from './system-state-service';
    import {
        fetchCandidateValidators,
        fetchInactiveValidators,
        fetchLatestSystemState,
        fetchPendingValidators,
    } from './system-state-service';

    let value = {};
    let apiVersion = '';
    let stakeInfo: StakeInfo = {};
    let showAllValidatorData = false;

    const getLatestSystemState = async () => {
        try {
            const client = getClient();
            const {
                formattedSystemState,
                stakeInfo: newStakeInfo,
                apiVersion: newApiVersion,
            } = await fetchLatestSystemState(client);
            value = formattedSystemState;
            stakeInfo = newStakeInfo;
            apiVersion = newApiVersion;
        } catch (err: any) {
            value = err.toString();
            console.error(err);
        }
    };

    const getCandidateValidators = async () => {
        try {
            const client = getClient();
            const { formattedValidators, stakeInfo: newStakeInfo } = await fetchCandidateValidators(
                client,
                showAllValidatorData,
            );
            value = formattedValidators;
            stakeInfo = newStakeInfo;
        } catch (err: any) {
            value = err.toString();
            console.error(err);
        }
    };

    const getPendingValidators = async () => {
        try {
            const client = getClient();
            const { formattedValidators, stakeInfo: newStakeInfo } = await fetchPendingValidators(
                client,
                showAllValidatorData,
            );
            value = formattedValidators;
            stakeInfo = newStakeInfo;
        } catch (err: any) {
            value = err.toString();
            console.error(err);
        }
    };

    const getInactiveValidators = async () => {
        try {
            const client = getClient();
            const { formattedValidators } = await fetchInactiveValidators(
                client,
                showAllValidatorData,
            );
            value = formattedValidators;
        } catch (err: any) {
            value = err.toString();
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
    <JsonToggleView {value} />
    <pre class="value" style="text-align: left" hidden={stakeInfo.totalSupply === '0'}>
        {'\n' + JSON.stringify(stakeInfo, null, 2)}
    </pre>
</main>

<style>
    button {
        margin: 0.5rem;
    }
</style>

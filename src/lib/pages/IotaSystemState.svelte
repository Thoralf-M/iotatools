<script lang="ts">
    import type { LatestIotaSystemStateSummary } from '@iota/iota-sdk/client';

    import JsonToggleView from '../components/JsonToggleView.svelte';
    import { getClient } from '../lib/client';

    let value = {};
    let apiVersion = '';
    let stakeInfo = {
        totalSupply: undefined,
        totalStake: undefined,
        pendingStake: undefined,
        nextEpochStake: undefined,
        candidateValidatorsStake: undefined,
        pendingValidatorsStake: undefined,
    };
    const getLatestSystemState = async () => {
        try {
            let client = getClient();
            apiVersion = (await client.getRpcApiVersion()) || '';
            const systemState = await client.getLatestIotaSystemState();
            console.log(systemState);
            value = formatNumbersWithUnderscores(systemState);
            stakeInfo = systemStateStake(stakeInfo, systemState);
            stakeInfo = formatNumbersWithUnderscores(stakeInfo);
        } catch (err: any) {
            value = err.toString();
            console.error(err);
        }
    };
    let showAllValidatorData = false;
    const getCandidateValidators = async () => {
        try {
            let client = getClient();
            apiVersion = (await client.getRpcApiVersion()) || '';
            const systemState = await client.getLatestIotaSystemState();

            stakeInfo = systemStateStake(stakeInfo, systemState);
            // @ts-ignore
            stakeInfo.candidateValidatorsStake = 0;

            const validatorCandidatesId = systemState.validatorCandidatesId;
            let hasNextPage = true;
            let nextPageCursor;
            let validatorCandidates = [];
            while (hasNextPage) {
                const candidateValidatorsPage = await client.getDynamicFields({
                    parentId: validatorCandidatesId,
                    cursor: nextPageCursor,
                });
                for (const candidateValidator of candidateValidatorsPage.data) {
                    const validatorWrapper = await client.getDynamicFieldObject({
                        parentId: validatorCandidatesId,
                        name: candidateValidator.name,
                    });
                    const validatorV1 = await client.getDynamicFields({
                        parentId:
                            // @ts-ignore
                            validatorWrapper.data?.content.fields.value.fields.inner.fields.id.id,
                    });
                    const validatorObject = await client.getObject({
                        id: validatorV1.data[0].objectId,
                        options: { showContent: true },
                    });

                    const validator =
                        // @ts-ignore
                        validatorObject.data?.content.fields.value.fields;

                    // @ts-ignore
                    stakeInfo.candidateValidatorsStake += parseInt(
                        validator.staking_pool.fields.iota_balance,
                    );
                    if (!showAllValidatorData) {
                        cleanupValidatorFields(validator);
                    }
                    validatorCandidates.push(validator);
                    value = formatNumbersWithUnderscores(validatorCandidates);
                }
                hasNextPage = candidateValidatorsPage.hasNextPage;
                if (hasNextPage) {
                    nextPageCursor = candidateValidatorsPage.nextCursor;
                }
            }
            if (validatorCandidates.length == 0) {
                value = 'No candidate validators';
            }
            stakeInfo = formatNumbersWithUnderscores(stakeInfo);
        } catch (err: any) {
            value = err.toString();
            console.error(err);
        }
    };
    const getPendingValidators = async () => {
        try {
            let client = getClient();
            apiVersion = (await client.getRpcApiVersion()) || '';
            const systemState = await client.getLatestIotaSystemState();

            stakeInfo = systemStateStake(stakeInfo, systemState);
            // @ts-ignore
            stakeInfo.pendingValidatorsStake = 0;

            const pendingActiveValidatorsId = systemState.pendingActiveValidatorsId;

            let hasNextPage = true;
            let nextPageCursor;
            let pendingValidators = [];
            while (hasNextPage) {
                const pendingValidatorsPage = await client.getDynamicFields({
                    parentId: pendingActiveValidatorsId,
                    cursor: nextPageCursor,
                });
                for (const pendingValidator of pendingValidatorsPage.data) {
                    const validatorObject = await client.getObject({
                        id: pendingValidator.objectId,
                        options: { showContent: true },
                    });

                    const validator =
                        // @ts-ignore
                        validatorObject.data?.content.fields.value.fields;

                    // @ts-ignore
                    stakeInfo.pendingValidatorsStake += parseInt(
                        validator.staking_pool.fields.iota_balance,
                    );
                    if (!showAllValidatorData) {
                        cleanupValidatorFields(validator);
                    }
                    pendingValidators.push(validator);
                    value = formatNumbersWithUnderscores(pendingValidators);
                }
                hasNextPage = pendingValidatorsPage.hasNextPage;
                if (hasNextPage) {
                    nextPageCursor = pendingValidatorsPage.nextCursor;
                }
            }
            if (pendingValidators.length == 0) {
                value = 'No pending validators';
            }
            stakeInfo = formatNumbersWithUnderscores(stakeInfo);
        } catch (err: any) {
            value = err.toString();
            console.error(err);
        }
    };
    function systemStateStake(stakeInfo: any, systemState: LatestIotaSystemStateSummary) {
        // @ts-ignore
        stakeInfo.totalSupply = parseInt(systemState.iotaTotalSupply);
        // @ts-ignore
        stakeInfo.totalStake = parseInt(systemState.totalStake);
        // @ts-ignore
        stakeInfo.pendingStake = 0;
        // @ts-ignore
        stakeInfo.nextEpochStake = 0;
        for (const validator of systemState.activeValidators) {
            // @ts-ignore
            stakeInfo.pendingStake += parseInt(validator.pendingStake);
            // @ts-ignore
            stakeInfo.nextEpochStake += parseInt(validator.nextEpochStake);
        }
        return stakeInfo;
    }
    // Remove fields from the validator to have a cleaner output
    function cleanupValidatorFields(validator: any) {
        delete validator.extra_fields;
        delete validator.metadata.type;
        delete validator.metadata.fields.authority_pubkey_bytes;
        delete validator.metadata.fields.next_epoch_authority_pubkey_bytes;
        delete validator.metadata.fields.next_epoch_net_address;
        delete validator.metadata.fields.next_epoch_network_pubkey_bytes;
        delete validator.metadata.fields.next_epoch_p2p_address;
        delete validator.metadata.fields.next_epoch_primary_address;
        delete validator.metadata.fields.next_epoch_proof_of_possession;
        delete validator.metadata.fields.next_epoch_protocol_pubkey_bytes;
        delete validator.metadata.fields.net_address;
        delete validator.metadata.fields.p2p_address;
        delete validator.metadata.fields.primary_address;
        delete validator.metadata.fields.image_url;
        delete validator.metadata.fields.extra_fields;
        delete validator.metadata.fields.network_pubkey_bytes;
        delete validator.metadata.fields.proof_of_possession;
        delete validator.metadata.fields.protocol_pubkey_bytes;
        delete validator.staking_pool.type;
        delete validator.staking_pool.fields.exchange_rates;
        delete validator.staking_pool.fields.extra_fields;
        delete validator.staking_pool.fields.id;
    }
    function formatNumbersWithUnderscores(obj: object): any {
        // Helper function to add _ as a thousands separator
        function formatNumber(n: any) {
            return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '_');
        }

        // Recursively process the object
        function process(value: object): object {
            if (Array.isArray(value)) {
                return value.map(process);
            } else if (value !== null && typeof value === 'object') {
                const newObj = {};
                for (const key in value) {
                    // @ts-ignore
                    newObj[key] = process(value[key]);
                }
                return newObj;
            } else if (
                typeof value === 'number' ||
                (typeof value === 'string' && /^\d+$/.test(value))
            ) {
                return formatNumber(value);
            } else {
                return value;
            }
        }

        return process(obj);
    }
</script>

<main>
    <button on:click={() => getLatestSystemState()}> get latest IOTA system state </button>
    <button on:click={() => getCandidateValidators()}> candidate validators </button>
    <button on:click={() => getPendingValidators()}> pending validators </button>
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
    <pre class="value" style="text-align: left" hidden={stakeInfo.totalSupply == 0}>
        {'\n' + JSON.stringify(stakeInfo, null, 2)}
    </pre>
</main>

<style>
    button {
        margin: 0.5rem;
    }
</style>

<script lang="ts">
    import type {
        DelegatedStake,
        DelegatedTimelockedStake,
        IotaObjectData,
    } from '@iota/iota-sdk/client';
    import { Transaction } from '@iota/iota-sdk/transactions';
    import { IOTA_SYSTEM_STATE_OBJECT_ID, isValidIotaAddress } from '@iota/iota-sdk/utils';

    import IotaAmountInput from '../../components/IotaAmountInput.svelte';
    import TransactionView from '../../components/TransactionView.svelte';
    import { getClient } from '../../utils/client';
    import {
        formatNumbersWithUnderscores,
        formatNumberWithUnderscores,
    } from '../../utils/iota-nano-conversion';
    import { activeAddress } from '../../utils/signer-data';
    import { executeTransaction } from '../../utils/transaction-execution';
    import {
        buildSingleObjectUnstakeTransaction,
        buildStakeTransaction,
        buildUnstakeAllTransaction,
        buildUnstakeSingleTransaction,
        computeRequiredUnstakeAmount,
        devInspectStakedObject,
        getTimelockedObjects,
        unstakeSpecificAmountSimulation,
    } from './staking-operations';
    import {
        fetchValidatorByAddress,
        getCommitteeMemberAddresses,
        isValidatorCommitteeMember,
        loadValidators as loadValidatorsService,
    } from './validator-service';

    let validatorAddress = '';
    const minStakeAmount = 2_000_000_000;
    let amount = minStakeAmount;
    // Will be updated with the result
    let value = {};
    let devInspectValue = {};
    let stakedIotaObjectId = '0x';

    interface ValidatorInfo {
        address: string;
        name: string;
        status: 'Committee Member' | 'Active Validator' | 'Candidate';
        stake: string;
    }

    // Validator selection variables
    let validators: ValidatorInfo[] = [];
    let loadingValidators = false;
    let showValidatorSelection = false;
    let selectedValidator: ValidatorInfo | null = null;
    let showCommitteeMembers = true;
    let showCandidates = true;

    const stake = async () => {
        try {
            if (!isValidIotaAddress(validatorAddress)) {
                throw new Error('invalid address');
            }
            const tx = buildStakeTransaction(validatorAddress, amount);
            value = await executeTransaction(tx);
        } catch (err: any) {
            value = err.toString();
            console.error(err);
        }
    };

    async function unstakeSingle() {
        try {
            const tx = await buildUnstakeSingleTransaction(getClient(), stakedIotaObjectId);
            value = await executeTransaction(tx);
        } catch (err: any) {
            value = err.toString();
            console.error(err);
        }
    }

    async function computeRewards(stakedIotaObjectId: string) {
        try {
            let stakeData = await devInspectStakedObject(
                getClient(),
                stakedIotaObjectId,
                $activeAddress,
            );
            stakeData = formatNumbersWithUnderscores(stakeData);
            devInspectValue = stakeData;
        } catch (err: any) {
            devInspectValue = err.toString();
            console.error(err);
        }
    }

    async function unstakeSpecificAmountSim(stakedIotaObjectId: string) {
        try {
            const results = await unstakeSpecificAmountSimulation(
                getClient(),
                stakedIotaObjectId,
                BigInt(amount),
                $activeAddress,
            );
            value = results;
        } catch (err: any) {
            value = err.toString();
            console.error(err);
        }
    }

    async function unstakeSpecificAmount(stakedIotaObjectId: string) {
        try {
            const { amount: initialUnstakeAmount, timelocked } = await computeRequiredUnstakeAmount(
                getClient(),
                stakedIotaObjectId,
                BigInt(amount),
                $activeAddress,
            );

            const tx = buildSingleObjectUnstakeTransaction(
                stakedIotaObjectId,
                initialUnstakeAmount,
                timelocked,
                $activeAddress,
            );

            value = await executeTransaction(tx);
        } catch (err: any) {
            value = err.toString();
            console.error(err);
        }
    }

    const handleLoadValidators = async () => {
        try {
            loadingValidators = true;
            validators = [];

            const client = getClient();
            const systemState = await client.getLatestIotaSystemState();

            console.log('System state structure:', systemState);

            const committeeMemberAddresses = getCommitteeMemberAddresses(systemState);

            // Add active validators
            for (const validator of systemState.activeValidators) {
                // Check if this validator is a committee member
                const isCommitteeMember = isValidatorCommitteeMember(
                    validator.iotaAddress,
                    committeeMemberAddresses,
                );
                validators.push({
                    address: validator.iotaAddress,
                    name: validator.name || 'Unknown',
                    status: isCommitteeMember ? 'Committee Member' : 'Active Validator',
                    stake: validator.stakingPoolIotaBalance,
                });
            }

            // Add candidate validators
            const validatorCandidatesId = systemState.validatorCandidatesId;
            let hasNextPage = true;
            let nextPageCursor;

            while (hasNextPage) {
                const candidateValidatorsPage = await client.getDynamicFields({
                    parentId: validatorCandidatesId,
                    cursor: nextPageCursor,
                });

                for (const candidateValidator of candidateValidatorsPage.data) {
                    try {
                        const validatorWrapper = await client.getDynamicFieldObject({
                            objectId: validatorCandidatesId,
                            name: candidateValidator.name,
                        } as any);

                        const validatorV1 = await client.getDynamicFields({
                            parentId:
                                // @ts-ignore
                                validatorWrapper.data?.content.fields.value.fields.inner.fields.id
                                    .id,
                        });

                        const validatorObject = await client.getObject({
                            id: validatorV1.data[0].objectId,
                            options: { showContent: true },
                        });

                        const validator =
                            // @ts-ignore
                            validatorObject.data?.content.fields.value.fields;

                        validators.push({
                            address: validator.metadata.fields.iota_address,
                            name: validator.metadata.fields.name || 'Unknown',
                            status: 'Candidate',
                            stake: validator.staking_pool.fields.iota_balance,
                        });
                    } catch (err) {
                        console.warn('Failed to load candidate validator:', err);
                    }
                }

                hasNextPage = candidateValidatorsPage.hasNextPage;
                if (hasNextPage) {
                    nextPageCursor = candidateValidatorsPage.nextCursor;
                }
            }

            // Sort validators: Committee members first, then active validators, then candidates
            validators.sort((a, b) => {
                const statusOrder: Record<ValidatorInfo['status'], number> = {
                    'Committee Member': 0,
                    'Active Validator': 1,
                    Candidate: 2,
                };
                return statusOrder[a.status] - statusOrder[b.status];
            });
        } catch (err: any) {
            console.error('Failed to load validators:', err);
            value = 'Failed to load validators: ' + err.toString();
        } finally {
            loadingValidators = false;
        }
    };

    const selectValidator = (address: string) => {
        validatorAddress = address;
        selectedValidator = validators.find((v) => v.address === address) || null;
        showValidatorSelection = false;
    };

    const findValidatorByAddress = (address: string) => {
        if (validators.length === 0) return null;
        return validators.find((v) => v.address === address) || null;
    };

    const handleFetchValidatorByAddress = async (address: string) => {
        const validator = await fetchValidatorByAddress(getClient(), address);
        if (validator && validatorAddress === validator.address) {
            selectedValidator = validator;
        }
    };

    // Update selected validator when address changes
    $: {
        if (validatorAddress && isValidIotaAddress(validatorAddress)) {
            // First try to find in loaded validators
            const foundValidator = findValidatorByAddress(validatorAddress);
            if (foundValidator) {
                selectedValidator = foundValidator;
            } else {
                // If not found in loaded validators, fetch it
                handleFetchValidatorByAddress(validatorAddress);
            }
        } else {
            selectedValidator = null;
        }
    }

    async function unstakeAll() {
        try {
            const staked = (await listStakedIota())!;
            const tx = buildUnstakeAllTransaction(
                staked.stakedIota,
                staked.timelockedStakedIota,
                $activeAddress,
            );
            value = await executeTransaction(tx);
        } catch (err: any) {
            value = err.toString();
            console.error(err);
        }
    }

    const handleGetTimelockedObjects = async (): Promise<IotaObjectData[]> => {
        return getTimelockedObjects(getClient(), $activeAddress);
    };

    const stakeAllTimelockedObjects = async () => {
        try {
            if (!isValidIotaAddress(validatorAddress)) {
                throw new Error('invalid address');
            }
            const tx = new Transaction();
            let timelockedObjects = await handleGetTimelockedObjects();

            for (const timelockedObject of timelockedObjects) {
                tx.moveCall({
                    target: '0x3::timelocked_staking::request_add_stake',
                    arguments: [
                        tx.sharedObjectRef({
                            objectId: IOTA_SYSTEM_STATE_OBJECT_ID,
                            initialSharedVersion: 1,
                            mutable: true,
                        }),
                        tx.object(timelockedObject.objectId),
                        tx.pure.address(validatorAddress),
                    ],
                });
            }

            value = await executeTransaction(tx);
        } catch (err: any) {
            value = err.toString();
            console.error(err);
        }
    };
    async function listStakedIota(): Promise<
        | {
              stakedIota: DelegatedStake[];
              timelockedStakedIota: DelegatedTimelockedStake[];
              totalRewards: string;
          }
        | undefined
    > {
        try {
            const client = getClient();
            const stakedIota = await client.getStakes({
                owner: $activeAddress,
            });
            let totalRewards = BigInt(0);

            const timelockedStakedIota = await client.getTimelockedStakes({
                owner: $activeAddress,
            });
            if (stakedIota.length == 0 && timelockedStakedIota.length == 0) {
                throw new Error('no staked IOTA found');
            }
            if (stakedIota.length != 0) {
                stakedIotaObjectId = stakedIota[0].stakes[0].stakedIotaId;
            } else {
                stakedIotaObjectId = timelockedStakedIota[0].stakes[0].timelockedStakedIotaId;
            }

            for (let delegatedStake of stakedIota) {
                for (let stake of delegatedStake.stakes) {
                    let stakeData = await devInspectStakedObject(
                        getClient(),
                        stake.stakedIotaId,
                        $activeAddress,
                    );
                    totalRewards += BigInt(stakeData.rewards);
                    // @ts-ignore
                    stake.actualRewards = stakeData.rewards;
                    let formattedStake = formatNumbersWithUnderscores(stake);
                    for (const key in formattedStake) {
                        // @ts-ignore
                        stake[key] = formattedStake[key];
                    }
                }
            }

            for (let delegatedTimelockedStake of timelockedStakedIota) {
                for (let timelockedStake of delegatedTimelockedStake.stakes) {
                    let stakeData = await devInspectStakedObject(
                        getClient(),
                        timelockedStake.timelockedStakedIotaId,
                        $activeAddress,
                    );
                    totalRewards += BigInt(stakeData.rewards);
                    // @ts-ignore
                    timelockedStake.actualRewards = stakeData.rewards;
                    let formattedTimelockedStake = formatNumbersWithUnderscores(timelockedStake);
                    for (const key in formattedTimelockedStake) {
                        // @ts-ignore
                        timelockedStake[key] = formattedTimelockedStake[key];
                    }
                }
            }

            let res = {
                stakedIota,
                timelockedStakedIota,
                totalRewards: formatNumberWithUnderscores(totalRewards),
            };
            value = res;

            return res;
        } catch (err: any) {
            value = err.toString();
            console.error(err);
        }
    }
</script>

<main>
    <button on:click={() => listStakedIota()}> list staked IOTA </button>
    <br />
    <span>
        staked object id:
        <input
            bind:value={stakedIotaObjectId}
            placeholder="staked IOTA object id 0x..."
            style="width: min(74ch, 100%); max-width: 100%; box-sizing: border-box; font-family: monospace;"
        />
    </span>
    <button on:click={() => computeRewards(stakedIotaObjectId)}> compute real rewards </button>
    {#if Object.keys(devInspectValue).length > 0}
        <div style="text-align: center;">
            <pre style="display: inline-block; text-align: left; margin: 0rem;">{JSON.stringify(
                    devInspectValue,
                    null,
                    2,
                )}</pre>
        </div>
    {/if}
    <hr />
    It's only possible to stake to a candidate or active/committee validator, pending is not possible.
    <br />
    <span>
        validator address:
        <input
            bind:value={validatorAddress}
            placeholder="validator address 0x..."
            style="width: min(74ch, 100%); max-width: 100%; box-sizing: border-box; font-family: monospace;"
        />
        <button
            on:click={() => {
                showValidatorSelection = !showValidatorSelection;
                if (showValidatorSelection) handleLoadValidators();
            }}
        >
            {showValidatorSelection ? 'Hide' : selectedValidator ? 'Change' : 'Select'} Validator
        </button>
    </span>

    {#if showValidatorSelection}
        <div class="validator-selection">
            {#if loadingValidators}
                <p>Loading validators...</p>
            {:else if validators.length === 0}
                <button on:click={handleLoadValidators}>Load Validators</button>
            {:else}
                <div>
                    <strong>Select a validator:</strong>
                </div>

                <!-- Candidates Section -->
                {#if validators.filter((v) => v.status === 'Candidate').length > 0}
                    <div style="margin-bottom: 1rem;">
                        <div
                            class="section-header"
                            style="font-weight: bold; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; display: flex; justify-content: space-between; align-items: center;"
                            on:click={() => (showCandidates = !showCandidates)}
                            on:keydown={(e) =>
                                e.key === 'Enter' && (showCandidates = !showCandidates)}
                            role="button"
                            tabindex="0"
                        >
                            <span
                                >Candidates ({validators.filter((v) => v.status === 'Candidate')
                                    .length})</span
                            >
                            <span>{showCandidates ? '▼' : '▶'}</span>
                        </div>
                        {#if showCandidates}
                            {#each validators.filter((v) => v.status === 'Candidate') as validator}
                                <div
                                    class="validator-item"
                                    style="margin: 0.125rem 0; border: 1px solid grey; border-radius: 4px; cursor: pointer;"
                                    on:click={() => selectValidator(validator.address)}
                                    on:keydown={(e) =>
                                        e.key === 'Enter' && selectValidator(validator.address)}
                                    role="button"
                                    tabindex="0"
                                >
                                    <div class="validator-content">
                                        <span class="validator-address">{validator.address}</span>
                                        <span class="validator-status" style="color: #c62828;"
                                            >{validator.status}</span
                                        >
                                        <span class="validator-name">{validator.name}</span>
                                        <span class="validator-stake"
                                            >Current Stake: {formatNumberWithUnderscores(
                                                validator.stake,
                                            )} NANO</span
                                        >
                                    </div>
                                </div>
                            {/each}
                        {/if}
                    </div>
                {/if}

                <!-- Active Validators Section -->
                {#if validators.filter((v) => v.status === 'Committee Member' || v.status === 'Active Validator').length > 0}
                    <div>
                        <div
                            class="section-header"
                            style="font-weight: bold; border: 1px solid grey; border-radius: 4px; cursor: pointer; display: flex; justify-content: space-between; align-items: center;"
                            on:click={() => (showCommitteeMembers = !showCommitteeMembers)}
                            on:keydown={(e) =>
                                e.key === 'Enter' && (showCommitteeMembers = !showCommitteeMembers)}
                            role="button"
                            tabindex="0"
                        >
                            <span
                                >Active Validators ({validators.filter(
                                    (v) =>
                                        v.status === 'Committee Member' ||
                                        v.status === 'Active Validator',
                                ).length})</span
                            >
                            <span>{showCommitteeMembers ? '▼' : '▶'}</span>
                        </div>
                        {#if showCommitteeMembers}
                            {#each validators.filter((v) => v.status === 'Committee Member' || v.status === 'Active Validator') as validator}
                                <div
                                    class="validator-item"
                                    style="margin: 0.125rem 0; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;"
                                    on:click={() => selectValidator(validator.address)}
                                    on:keydown={(e) =>
                                        e.key === 'Enter' && selectValidator(validator.address)}
                                    role="button"
                                    tabindex="0"
                                >
                                    <div class="validator-content">
                                        <span class="validator-address">{validator.address}</span>
                                        <span
                                            class="validator-status"
                                            style="color: {validator.status === 'Committee Member'
                                                ? '#2e7d32'
                                                : '#f57f17'};">{validator.status}</span
                                        >
                                        <span class="validator-name">{validator.name}</span>
                                        <span class="validator-stake"
                                            >Current Stake: {formatNumberWithUnderscores(
                                                validator.stake,
                                            )} NANO</span
                                        >
                                    </div>
                                </div>
                            {/each}
                        {/if}
                    </div>
                {/if}
            {/if}
        </div>
    {:else if selectedValidator}
        <div class="validator-selection">
            <div>
                <strong>Selected Validator:</strong>
                <button
                    on:click={() => {
                        showValidatorSelection = true;
                    }}
                    style="margin-left: 1rem; font-size: 0.8em;">Change</button
                >
            </div>
            <div
                class="validator-item"
                style="padding: 0.25rem 0.5rem; border: 1px solid #ddd; border-radius: 4px;"
            >
                <div class="validator-content">
                    <span class="validator-address">{selectedValidator.address}</span>
                    <span
                        class="validator-status"
                        style="color: {selectedValidator.status === 'Committee Member'
                            ? '#2e7d32'
                            : selectedValidator.status === 'Active Validator'
                              ? '#f57f17'
                              : '#c62828'};">{selectedValidator.status}</span
                    >
                    <span class="validator-name">{selectedValidator.name}</span>
                    <span class="validator-stake"
                        >Current Stake: {formatNumberWithUnderscores(selectedValidator.stake)} NANO</span
                    >
                </div>
            </div>
        </div>
    {/if}
    <br />
    <div style="margin-bottom: 1rem; display: flex; justify-content: center;">
        <IotaAmountInput
            id="stake-amount"
            label="Amount (min 1 IOTA, to unstake with rewards even more)"
            bind:value={amount}
            placeholder="1000000000"
        />
    </div>
    <br />

    <button on:click={() => stake()}> stake </button>
    <button on:click={() => unstakeSingle()}> unstake single object </button>
    <button on:click={() => unstakeAll()}> unstake all </button>
    <button on:click={() => unstakeSpecificAmountSim(stakedIotaObjectId)}>
        simulate unstake specific amount
    </button>
    <button on:click={() => unstakeSpecificAmount(stakedIotaObjectId)}>
        unstake specific amount (exact is usually not possible)
    </button>

    <hr />
    <button
        on:click={() => {
            handleGetTimelockedObjects()
                .then((timelockedObjects) => {
                    value = timelockedObjects;
                })
                .catch((err) => {
                    value = err.toString();
                    console.error(err);
                });
        }}
    >
        list timelocked objects
    </button>
    <button on:click={() => stakeAllTimelockedObjects()}> stake all timelocked objects </button>

    <TransactionView {value} />
</main>

<style>
    button {
        margin: 0.5rem;
    }

    .validator-item {
        transition:
            background-color 0.2s ease,
            border-color 0.2s ease;
    }

    .validator-item:hover {
        background-color: #525252 !important;
        border-color: #999 !important;
    }

    .section-header {
        transition: background-color 0.2s ease;
    }

    .section-header:hover {
        background-color: #474747 !important;
    }

    .validator-selection {
        max-height: 400px;
        overflow-y: auto;
        border: 1px solid #ccc;
        border-radius: 4px;
        margin: 1rem 0;
        padding: 1rem;
    }

    .validator-content {
        font-size: 0.85em;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .validator-address {
        font-family: monospace;
        flex-shrink: 0;
        word-break: break-all;
        overflow-wrap: break-word;
        max-width: 50%;
    }

    .validator-status {
        font-weight: bold;
        font-size: 0.9em;
        flex-shrink: 0;
        white-space: nowrap;
    }

    .validator-name {
        font-weight: bold;
        flex-shrink: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 200px;
    }

    .validator-stake {
        font-size: 0.9em;
        margin-left: auto;
        flex-shrink: 0;
        white-space: nowrap;
    }

    /* Responsive: wrap on small screens */
    @media (max-width: 768px) {
        .validator-content {
            flex-wrap: wrap;
            gap: 0.25rem;
        }

        .validator-address {
            width: 100%;
            margin-bottom: 0.25rem;
            max-width: 100%;
        }

        .validator-stake {
            margin-left: 0;
        }
    }

    /* Input field styling to prevent overflow */
    input[placeholder*='address'],
    input[placeholder*='object'] {
        max-width: 100%;
        box-sizing: border-box;
        word-break: break-all;
    }

    /* Responsive input sizing */
    @media (max-width: 768px) {
        span {
            word-break: break-word;
            overflow-wrap: break-word;
        }
    }
</style>

<script lang="ts">
    import { bcs } from '@iota/bcs';
    import type {
        DelegatedStake,
        DelegatedTimelockedStake,
        IotaObjectData,
    } from '@iota/iota-sdk/client';
    import { Transaction } from '@iota/iota-sdk/transactions';
    import { IOTA_SYSTEM_STATE_OBJECT_ID, isValidIotaAddress } from '@iota/iota-sdk/utils';

    import TransactionView from '../components/TransactionView.svelte';
    import { getClient } from '../lib/client';
    import {
        formatNumbersWithUnderscores,
        formatNumberWithUnderscores,
    } from '../lib/iota-nano-conversion';
    import { activeAddress } from '../lib/signer-data';
    import { computeStakingRewards, type StakeData } from '../lib/staking-utils';
    import { executeTransaction } from '../lib/transaction-execution';

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

    // Helper function to get committee member addresses from system state
    const getCommitteeMemberAddresses = (systemState: any): Set<string> => {
        const committeeMemberAddresses = new Set<string>();

        if (systemState.committeeMembers && Array.isArray(systemState.committeeMembers)) {
            systemState.committeeMembers.forEach((validator: any) => {
                committeeMemberAddresses.add(validator.iotaAddress);
            });
        }

        return committeeMemberAddresses;
    };

    // Helper function to determine if a validator is a committee member
    const isValidatorCommitteeMember = (
        validatorAddress: string,
        committeeMemberAddresses: Set<string>,
    ): boolean => {
        return (
            committeeMemberAddresses.has(validatorAddress) || committeeMemberAddresses.size === 0
        );
    };

    const stake = async () => {
        try {
            if (!isValidIotaAddress(validatorAddress)) {
                throw new Error('invalid address');
            }
            const tx = new Transaction();
            const stakeCoin = tx.splitCoins(tx.gas, [amount]);
            tx.moveCall({
                target: '0x3::iota_system::request_add_stake',
                arguments: [
                    tx.sharedObjectRef({
                        objectId: IOTA_SYSTEM_STATE_OBJECT_ID,
                        initialSharedVersion: 1,
                        mutable: true,
                    }),
                    stakeCoin,
                    tx.pure.address(validatorAddress),
                ],
            });

            value = await executeTransaction(tx);
        } catch (err: any) {
            value = err.toString();
            console.error(err);
        }
    };
    async function unstakeSingle() {
        try {
            const client = getClient();
            let obj = await client.getObject({
                id: stakedIotaObjectId,
                options: { showContent: true },
            });
            let target;
            // @ts-ignore
            if (obj.data?.content?.type === '0x3::staking_pool::StakedIota') {
                target = '0x3::iota_system::request_withdraw_stake';
            }
            // @ts-ignore
            if (obj.data?.content?.type === '0x3::timelocked_staking::TimelockedStakedIota') {
                target = '0x3::timelocked_staking::request_withdraw_stake';
            }

            if (!target) {
                throw new Error('No staked IOTA object: ' + stakedIotaObjectId);
            }

            const tx = new Transaction();
            tx.moveCall({
                target,
                arguments: [
                    tx.sharedObjectRef({
                        objectId: IOTA_SYSTEM_STATE_OBJECT_ID,
                        initialSharedVersion: 1,
                        mutable: true,
                    }),
                    tx.object(stakedIotaObjectId),
                ],
            });

            value = await executeTransaction(tx);
        } catch (err: any) {
            value = err.toString();
            console.error(err);
        }
    }
    async function computeRewards(stakedIotaObjectId: string) {
        try {
            let stakeData = await devInspectStakedObject(stakedIotaObjectId);
            stakeData = formatNumbersWithUnderscores(stakeData);
            devInspectValue = stakeData;
        } catch (err: any) {
            devInspectValue = err.toString();
            console.error(err);
        }
    }
    async function unstakeSpecificAmountSimulation(stakedIotaObjectId: string) {
        try {
            let { amount: initialUnstakeAmount, timelocked } =
                await computeRequiredUnstakeAmount(stakedIotaObjectId);

            let results = [];
            const amountDifferences = [
                -1_000_000_000n,
                -1000n,
                -500n,
                -100n,
                -50n,
                -10n,
                -5n,
                -2n,
                -1n,
                0n,
                1n,
                2n,
                5n,
                10n,
                50n,
                100n,
                500n,
                1000n,
                1_000_000_000n,
                10_000_000_000n,
                1000_000_000_000n,
            ];
            for (let diff of amountDifferences) {
                let unstakeAmount = initialUnstakeAmount + diff;
                let tx = await buildSingleObjectUnstakeTransaction(
                    stakedIotaObjectId,
                    unstakeAmount,
                    timelocked,
                );

                let txRes = await getClient().devInspectTransactionBlock({
                    sender: $activeAddress,
                    transactionBlock: tx,
                });
                if (txRes.error) {
                    results.push(txRes.error);
                    continue;
                }

                let index = timelocked ? 1 : 0;
                // @ts-ignore
                let amountBytes = txRes.results[1].returnValues[index][0];
                let amountString = bcs.u64().parse(new Uint8Array(amountBytes));

                let resString = `Unstake amount with ${diff.toString().padStart(12, ' ')}: ${formatNumberWithUnderscores(unstakeAmount)}, would result in: ${formatNumberWithUnderscores(amountString)} for target amount: ${formatNumberWithUnderscores(amount)}`;
                if (unstakeAmount == initialUnstakeAmount) {
                    results.push(resString + ' this would be used');
                } else {
                    results.push(resString);
                }
                value = results;
            }

            value = results;
        } catch (err: any) {
            value = err.toString();
            console.error(err);
        }
    }
    async function buildSingleObjectUnstakeTransaction(
        stakedIotaObjectId: string,
        unstakeAmount: bigint,
        timelocked: boolean = false,
    ): Promise<Transaction> {
        const tx = new Transaction();
        let splitStakedIota = tx.moveCall({
            target: timelocked ? '0x3::timelocked_staking::split' : '0x3::staking_pool::split',
            arguments: [tx.object(stakedIotaObjectId), tx.pure.u64(unstakeAmount)],
        });
        let unstakedBalanceWithRewards;
        if (timelocked) {
            let [timelock, balance] = tx.moveCall({
                target: '0x3::timelocked_staking::request_withdraw_stake_non_entry',
                arguments: [tx.object('0x5'), tx.object(splitStakedIota)],
            });
            tx.moveCall({
                target: '0x2::timelock::transfer_to_sender',
                arguments: [timelock],
                typeArguments: ['0x2::balance::Balance<0x2::iota::IOTA>'],
            });
            unstakedBalanceWithRewards = balance;
        } else {
            let [balance] = tx.moveCall({
                target: '0x3::iota_system::request_withdraw_stake_non_entry',
                arguments: [tx.object('0x5'), splitStakedIota],
            });
            unstakedBalanceWithRewards = balance;
        }
        let [coin] = tx.moveCall({
            target: '0x2::coin::from_balance',
            arguments: [unstakedBalanceWithRewards!],
            typeArguments: ['0x2::iota::IOTA'],
        });
        tx.transferObjects([coin], tx.pure.address($activeAddress));
        return tx;
    }
    interface RequiredUnstakeAmount {
        amount: bigint;
        timelocked: boolean;
    }
    async function computeRequiredUnstakeAmount(
        stakedIotaObjectId: string,
    ): Promise<RequiredUnstakeAmount> {
        let stakeData = await devInspectStakedObject(stakedIotaObjectId);

        let obj = await getClient().getObject({
            id: stakedIotaObjectId,
            options: { showContent: true },
        });

        let timelocked = false;
        // @ts-ignore
        if (obj.data?.content?.type === '0x3::timelocked_staking::TimelockedStakedIota') {
            timelocked = true;
        }
        // @ts-ignore
        if (!timelocked && obj.data?.content?.type != '0x3::staking_pool::StakedIota') {
            throw new Error('No staked IOTA object: ' + stakedIotaObjectId);
        }

        let initialStaked = BigInt(stakeData.initialStakedAmount);
        let rewards = BigInt(stakeData.rewards);
        if (rewards === 0n) throw new Error('No rewards available to withdraw.');

        let initialUnstakeAmount: bigint;
        if (timelocked) {
            initialUnstakeAmount = (BigInt(amount) * initialStaked + rewards - 1n) / rewards;
        } else {
            initialUnstakeAmount =
                (BigInt(amount) * initialStaked + (initialStaked + rewards - 1n)) /
                (initialStaked + rewards);
        }
        return {
            amount: initialUnstakeAmount,
            timelocked,
        };
    }
    async function unstakeSpecificAmount(stakedIotaObjectId: string) {
        try {
            let { amount: initialUnstakeAmount, timelocked } =
                await computeRequiredUnstakeAmount(stakedIotaObjectId);

            let tx = await buildSingleObjectUnstakeTransaction(
                stakedIotaObjectId,
                initialUnstakeAmount,
                timelocked,
            );

            value = await executeTransaction(tx);
        } catch (err: any) {
            value = err.toString();
            console.error(err);
        }
    }
    async function devInspectStakedObject(stakedIotaObjectId: string): Promise<StakeData> {
        const client = getClient();
        return computeStakingRewards(client, stakedIotaObjectId, $activeAddress);
    }

    const loadValidators = async () => {
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
                            parentId: validatorCandidatesId,
                            name: candidateValidator.name,
                        });

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

    const fetchValidatorByAddress = async (address: string): Promise<ValidatorInfo | null> => {
        if (!address || !isValidIotaAddress(address)) return null;

        try {
            const client = getClient();
            const systemState = await client.getLatestIotaSystemState();

            const committeeMemberAddresses = getCommitteeMemberAddresses(systemState);

            // Check in active validators first
            for (const validator of systemState.activeValidators) {
                if (validator.iotaAddress === address) {
                    const isCommitteeMember = isValidatorCommitteeMember(
                        validator.iotaAddress,
                        committeeMemberAddresses,
                    );

                    return {
                        address: validator.iotaAddress,
                        name: validator.name || 'Unknown',
                        status: isCommitteeMember ? 'Committee Member' : 'Active Validator',
                        stake: validator.stakingPoolIotaBalance,
                    };
                }
            }

            // Check in candidate validators
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
                            parentId: validatorCandidatesId,
                            name: candidateValidator.name,
                        });

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

                        if (validator.metadata.fields.iota_address === address) {
                            return {
                                address: validator.metadata.fields.iota_address,
                                name: validator.metadata.fields.name || 'Unknown',
                                status: 'Candidate',
                                stake: validator.staking_pool.fields.iota_balance,
                            };
                        }
                    } catch (err) {
                        console.warn('Failed to check candidate validator:', err);
                    }
                }

                hasNextPage = candidateValidatorsPage.hasNextPage;
                if (hasNextPage) {
                    nextPageCursor = candidateValidatorsPage.nextCursor;
                }
            }

            return null;
        } catch (err) {
            console.warn('Failed to fetch validator by address:', err);
            return null;
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
                fetchValidatorByAddress(validatorAddress).then((validator) => {
                    if (validator && validatorAddress === validator.address) {
                        selectedValidator = validator;
                    }
                });
            }
        } else {
            selectedValidator = null;
        }
    }
    async function unstakeAll() {
        try {
            let staked = (await listStakedIota())!;

            const tx = new Transaction();
            let firstBalance;
            for (let [index, delegatedStake] of staked.stakedIota.entries()) {
                for (let [innerIndex, stake] of delegatedStake.stakes.entries()) {
                    let balance = tx.moveCall({
                        target: '0x3::iota_system::request_withdraw_stake_non_entry',
                        arguments: [tx.object('0x5'), tx.object(stake.stakedIotaId)],
                    });
                    if (index == 0 && innerIndex == 0) {
                        firstBalance = balance;
                    } else {
                        // Merge additional balances to the first balance, to only get a single coin at the end
                        tx.moveCall({
                            target: '0x2::balance::join',
                            arguments: [firstBalance!, balance],
                            typeArguments: ['0x2::iota::IOTA'],
                        });
                    }
                }
            }
            for (let [index, delegatedTimelockedStake] of staked.timelockedStakedIota.entries()) {
                for (let [
                    innerIndex,
                    timelockedStake,
                ] of delegatedTimelockedStake.stakes.entries()) {
                    let [timelock, balance] = tx.moveCall({
                        target: '0x3::timelocked_staking::request_withdraw_stake_non_entry',
                        arguments: [
                            tx.object('0x5'),
                            tx.object(timelockedStake.timelockedStakedIotaId),
                        ],
                    });
                    tx.moveCall({
                        target: '0x2::timelock::transfer_to_sender',
                        arguments: [timelock],
                        typeArguments: ['0x2::balance::Balance<0x2::iota::IOTA>'],
                    });
                    if (index == 0 && innerIndex == 0 && !firstBalance) {
                        firstBalance = balance;
                    } else {
                        // Merge additional balances to the first balance, to only get a single coin at the end
                        tx.moveCall({
                            target: '0x2::balance::join',
                            arguments: [firstBalance!, balance],
                            typeArguments: ['0x2::iota::IOTA'],
                        });
                    }
                }
            }
            let [coin] = tx.moveCall({
                target: '0x2::coin::from_balance',
                arguments: [firstBalance!],
                typeArguments: ['0x2::iota::IOTA'],
            });
            tx.transferObjects([coin], tx.pure.address($activeAddress));

            value = await executeTransaction(tx);
        } catch (err: any) {
            value = err.toString();
            console.error(err);
        }
    }
    const getTimelockedObjects = async (): Promise<IotaObjectData[]> => {
        const client = getClient();
        // no pagination, but should be fine
        let ownedObjectPage = await client.getOwnedObjects({
            owner: $activeAddress,
            filter: {
                StructType: '0x2::timelock::TimeLock<0x2::balance::Balance<0x2::iota::IOTA>>',
            },
            options: {
                showContent: true,
            },
        });
        if (ownedObjectPage.data.length == 0) {
            throw new Error('no timelocked object found');
        }
        return ownedObjectPage.data.map((d) => d.data!);
    };
    const stakeAllTimelockedObjects = async () => {
        try {
            if (!isValidIotaAddress(validatorAddress)) {
                throw new Error('invalid address');
            }
            const tx = new Transaction();
            let timelockedObjects = await getTimelockedObjects();

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
                    let stakeData = await devInspectStakedObject(stake.stakedIotaId);
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
                        timelockedStake.timelockedStakedIotaId,
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
                if (showValidatorSelection) loadValidators();
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
                <button on:click={loadValidators}>Load Validators</button>
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
    <span>
        amount (min 1 IOTA, to unstake with rewards even more):
        <input
            type="number"
            bind:value={amount}
            placeholder="amount in NANO"
            min="1000000000"
            style="width: 14rem;"
        />
        <input
            type="number"
            value={(amount / 1_000_000_000).toFixed(9)}
            on:input={(e) => {
                // @ts-ignore
                amount = e.target.value * 1_000_000_000;
            }}
            placeholder="amount in IOTA"
            min="1"
            style="width: 14rem;"
        />
    </span>
    <br />

    <button on:click={() => stake()}> stake </button>
    <button on:click={() => unstakeSingle()}> unstake single object </button>
    <button on:click={() => unstakeAll()}> unstake all </button>
    <button on:click={() => unstakeSpecificAmountSimulation(stakedIotaObjectId)}>
        simulate unstake specific amount
    </button>
    <button on:click={() => unstakeSpecificAmount(stakedIotaObjectId)}>
        unstake specific amount (exact is usually not possible)
    </button>

    <hr />
    <button
        on:click={() => {
            getTimelockedObjects()
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

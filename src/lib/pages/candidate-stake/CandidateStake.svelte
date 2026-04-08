<script lang="ts">
    import { Transaction } from '@iota/iota-sdk/transactions';
    import { onMount } from 'svelte';

    import TransactionView from '../../components/TransactionView.svelte';
    import { getClient, getSelectedNetworkConfig } from '../../utils/client';
    import { getAddressLink, getObjectLink } from '../../utils/explorer-links';
    import { formatAddress } from '../../utils/formatting';
    import { sharedClientConfig } from '../../utils/local-storage-store';
    import { activeAddress } from '../../utils/signer-data';
    import { executeTransaction } from '../../utils/transaction-execution';
    import { getCandidateStakePackageId, getGraphqlUrl } from './candidate-stake-config';
    import {
        fetchActiveValidators,
        fetchCandidateValidators,
        fetchPools,
        fetchStakedObjects,
        type CandidateValidator,
        type PoolData,
        type StakedIotaInfo,
        type ValidatorSummary,
    } from './candidate-stake-data';

    const THRESHOLD = 2_000_000;
    const NANOS_PER_IOTA = 1_000_000_000;
    const GITHUB_REPO = 'https://github.com/Thoralf-M/candidate-stake';

    let packageId = $state('');
    let customPackageId = $state('');

    let pools = $state<PoolData[]>([]);
    let activeValidators = $state<Map<string, ValidatorSummary>>(new Map());
    let candidateValidators = $state<CandidateValidator[]>([]);
    let stakedObjects = $state<StakedIotaInfo[]>([]);

    let loading = $state(false);
    let loadingCandidates = $state(false);
    let error = $state('');
    let lightbox = $state(false);

    // Per-pool action state
    let selectedStakes = $state<Record<string, string>>({});
    let poolErrors = $state<Record<string, string>>({});
    let poolTxResults = $state<Record<string, any>>({});
    let poolPending = $state<Record<string, boolean>>({});

    // Create pool state
    let newPoolValidator = $state('');
    let createError = $state('');
    let createTxResult = $state<any>(null);
    let createPending = $state(false);

    function formatIota(nanos: string | number): string {
        const n = typeof nanos === 'string' ? Number(nanos) : nanos;
        return (n / NANOS_PER_IOTA).toLocaleString(undefined, { maximumFractionDigits: 2 });
    }

    function updatePackageId() {
        const detected = getCandidateStakePackageId();
        packageId = detected || customPackageId;
    }

    let initialLoadDone = false;

    async function loadPools() {
        if (!packageId) {
            pools = [];
            return;
        }
        if (!initialLoadDone) loading = true;
        error = '';
        try {
            const graphqlUrl = getGraphqlUrl();
            pools = await fetchPools(packageId, graphqlUrl);
        } catch (err: any) {
            error = err.message || String(err);
            pools = [];
        } finally {
            loading = false;
        }
    }

    async function loadValidators() {
        try {
            activeValidators = await fetchActiveValidators();
        } catch (err) {
            console.error('Failed to load validators:', err);
        }
    }

    async function loadCandidates() {
        if (!initialLoadDone) loadingCandidates = true;
        try {
            candidateValidators = await fetchCandidateValidators();
        } catch (err) {
            console.error('Failed to load candidate validators:', err);
        } finally {
            loadingCandidates = false;
        }
    }

    async function loadStakedObjects() {
        if (!$activeAddress || $activeAddress === '0x') {
            stakedObjects = [];
            return;
        }
        try {
            stakedObjects = await fetchStakedObjects($activeAddress);
        } catch (err) {
            console.error('Failed to load staked objects:', err);
        }
    }

    async function refreshAll() {
        await Promise.all([loadPools(), loadValidators(), loadCandidates(), loadStakedObjects()]);
        initialLoadDone = true;
    }

    // Merge active validators and candidates into one lookup
    function getAllValidators(): Map<string, ValidatorSummary> {
        const all = new Map(activeValidators);
        for (const c of candidateValidators) {
            if (!all.has(c.iotaAddress)) {
                all.set(c.iotaAddress, {
                    ...c,
                    nextEpochCommissionRate: c.commissionRate,
                });
            }
        }
        return all;
    }

    let allValidators = $derived(getAllValidators());

    let existingTargets = $derived(new Set(pools.map((p) => p.fields.target_validator)));

    let availableCandidates = $derived(
        candidateValidators.filter((c) => !existingTargets.has(c.iotaAddress)),
    );

    // --- Transaction actions ---

    async function waitForTxAndRefresh(result: any) {
        const digest = result?.digest;
        if (digest) {
            const client = getClient();
            await client.waitForTransaction({ digest, waitMode: 'checkpoint' });
        }
        await refreshAll();
    }

    async function execPoolAction(poolId: string, buildTx: (tx: Transaction) => void) {
        poolErrors[poolId] = '';
        poolTxResults[poolId] = null;
        poolPending[poolId] = true;
        try {
            const tx = new Transaction();
            buildTx(tx);
            const result = await executeTransaction(tx);
            poolTxResults[poolId] = result;
            await waitForTxAndRefresh(result);
        } catch (err: any) {
            poolErrors[poolId] = err.message || String(err);
        } finally {
            poolPending[poolId] = false;
        }
    }

    function deposit(poolId: string) {
        const stakeId = selectedStakes[poolId];
        if (!stakeId) return;
        selectedStakes[poolId] = '';
        execPoolAction(poolId, (tx) => {
            tx.moveCall({
                target: `${packageId}::candidate_stake::deposit`,
                arguments: [tx.object(poolId), tx.object(stakeId)],
            });
        });
    }

    function withdraw(poolId: string) {
        execPoolAction(poolId, (tx) => {
            tx.moveCall({
                target: `${packageId}::candidate_stake::withdraw`,
                arguments: [tx.object(poolId)],
            });
        });
    }

    function executeRestake(poolId: string) {
        execPoolAction(poolId, (tx) => {
            tx.moveCall({
                target: `${packageId}::candidate_stake::execute`,
                arguments: [tx.object(poolId), tx.object('0x5')],
            });
        });
    }

    function cancelPool(poolId: string) {
        execPoolAction(poolId, (tx) => {
            tx.moveCall({
                target: `${packageId}::candidate_stake::cancel`,
                arguments: [tx.object(poolId)],
            });
        });
    }

    function destroyEmpty(poolId: string) {
        execPoolAction(poolId, (tx) => {
            tx.moveCall({
                target: `${packageId}::candidate_stake::destroy_empty`,
                arguments: [tx.object(poolId)],
            });
        });
    }

    async function createPool() {
        if (!newPoolValidator) return;
        createError = '';
        createTxResult = null;
        createPending = true;
        try {
            const tx = new Transaction();
            tx.moveCall({
                target: `${packageId}::candidate_stake::create`,
                arguments: [tx.pure.address(newPoolValidator)],
            });
            const result = await executeTransaction(tx);
            createTxResult = result;
            newPoolValidator = '';
            await waitForTxAndRefresh(result);
        } catch (err: any) {
            createError = err.message || String(err);
        } finally {
            createPending = false;
        }
    }

    onMount(() => {
        updatePackageId();
        refreshAll();
    });

    // React to network changes
    $effect(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        $sharedClientConfig.selected;
        updatePackageId();
        refreshAll();
    });

    // React to address changes
    $effect(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        $activeAddress;
        loadStakedObjects();
    });
</script>

<div class="container">
    <!-- Package ID config -->
    <div class="toolbar">
        <div
            style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; width: 100%; justify-content: space-between;"
        >
            {#if getCandidateStakePackageId()}
                <a
                    href={getObjectLink(getSelectedNetworkConfig(), packageId)}
                    target="_blank"
                    rel="noreferrer"
                    class="pkg-link"
                    title={packageId}
                >
                    Package: {formatAddress(packageId)}
                </a>
            {:else}
                <input
                    type="text"
                    placeholder="Package ID (0x...)"
                    bind:value={customPackageId}
                    oninput={() => {
                        updatePackageId();
                        loadPools();
                    }}
                    style="min-width: 300px;"
                />
            {/if}
            <button onclick={refreshAll}>Refresh Data</button>
        </div>
    </div>

    <!-- Intro -->
    <details class="info-section">
        <summary>About CandidateStake</summary>
        <p class="intro-text">
            Pool your staked IOTA to help a candidate validator reach the 2,000,000 IOTA minimum
            required to join the active validator set. Deposit your existing <code>StakedIota</code>
            objects into a pool — they remain staked to their original validator and continue earning
            rewards until the pool is executed. You stay in full control and can withdraw at any time.
            Once the threshold is reached, the pool creator can trigger the restaking.
            <a href={GITHUB_REPO} target="_blank" rel="noreferrer">View smart contract on GitHub</a>
        </p>
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <picture class="flow-picture" onclick={() => (lightbox = true)}>
            <source media="(max-width: 768px)" srcset="./candidate-stake-flow-mobile.svg" />
            <img
                class="flow-diagram"
                src="./candidate-stake-flow.svg"
                alt="CandidateStake flow diagram"
            />
        </picture>
        {#if lightbox}
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div class="lightbox" onclick={() => (lightbox = false)}>
                <img
                    src={window.innerWidth <= 768
                        ? './candidate-stake-flow-mobile.svg'
                        : './candidate-stake-flow.svg'}
                    alt="CandidateStake flow diagram"
                />
            </div>
        {/if}
    </details>

    {#if packageId}
        <!-- Pools list -->
        {#if loading}
            <p class="muted">Loading pools...</p>
        {:else if error}
            <p class="error-text">{error}</p>
        {:else if pools.length === 0}
            <p class="muted" style="text-align: center; padding: 1rem;">
                No pools found for this package.
            </p>
        {:else}
            <div class="section">
                <h3 class="section-title">Pools ({pools.length})</h3>
                {#each pools as pool (pool.objectId)}
                    {@const fields = pool.fields}
                    {@const totalPrincipal = Number(fields.total_principal)}
                    {@const thresholdNanos = THRESHOLD * NANOS_PER_IOTA}
                    {@const progress = Math.min(100, (totalPrincipal / thresholdNanos) * 100)}
                    {@const isReady = totalPrincipal >= thresholdNanos}
                    {@const isCreator = $activeAddress === fields.creator}
                    {@const myDeposits = fields.deposits.filter(
                        (d) => d.depositor === $activeAddress,
                    )}
                    {@const myTotal = myDeposits.reduce(
                        (sum, d) => sum + Number(d.principal_amount),
                        0,
                    )}
                    {@const validator = allValidators.get(fields.target_validator)}
                    {@const isPending = poolPending[pool.objectId] ?? false}

                    <div class="pool-card">
                        <!-- Progress bar -->
                        <div class="progress-bar">
                            <div
                                class="fill"
                                class:complete={isReady}
                                style="width: {progress}%"
                            ></div>
                        </div>

                        <!-- Validator info -->
                        <div class="pool-details">
                            <span class="details-heading">Target Validator Info</span>
                            <div class="detail-row">
                                <span class="detail-label">Name:</span>
                                <span class="detail-value">{validator?.name ?? 'Unknown'}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Address:</span>
                                <span class="detail-value">
                                    <a
                                        href={getAddressLink(
                                            getSelectedNetworkConfig(),
                                            fields.target_validator,
                                        )}
                                        target="_blank"
                                        rel="noreferrer"
                                        title={fields.target_validator}
                                    >
                                        {fields.target_validator}
                                    </a>
                                </span>
                            </div>
                            {#if validator?.description}
                                <div class="detail-row">
                                    <span class="detail-label">Description:</span>
                                    <span class="detail-value">{validator.description}</span>
                                </div>
                            {/if}
                            {#if validator}
                                <div class="detail-row">
                                    <span class="detail-label">Commission:</span>
                                    <span class="detail-value"
                                        >{Number(validator.commissionRate) / 100}%</span
                                    >
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Pool balance:</span>
                                    <span class="detail-value"
                                        >{formatIota(validator.stakingPoolIotaBalance)} IOTA</span
                                    >
                                </div>
                                {#if validator.projectUrl}
                                    <div class="detail-row">
                                        <span class="detail-label">Website:</span>
                                        <span class="detail-value">
                                            <a
                                                href={validator.projectUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                {validator.projectUrl}
                                            </a>
                                        </span>
                                    </div>
                                {/if}
                            {/if}
                        </div>

                        <!-- Pool info -->
                        <div class="pool-details">
                            <div class="details-heading-row">
                                <span class="details-heading">Pool Info</span>
                                <span class="badge" class:ready={isReady} class:pending={!isReady}>
                                    {isReady ? 'Ready' : `${progress.toFixed(1)}%`}
                                </span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Pool ID:</span>
                                <span class="detail-value">
                                    <a
                                        href={getObjectLink(
                                            getSelectedNetworkConfig(),
                                            pool.objectId,
                                        )}
                                        target="_blank"
                                        rel="noreferrer"
                                        title={pool.objectId}
                                    >
                                        {pool.objectId}
                                    </a>
                                </span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Total staked:</span>
                                <span class="detail-value">
                                    {formatIota(fields.total_principal)} / {THRESHOLD.toLocaleString()}
                                    IOTA ({progress.toFixed(2)}%)
                                </span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Deposits:</span>
                                <span class="detail-value">{fields.deposits.length}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Creator:</span>
                                <span class="detail-value">
                                    <a
                                        href={getAddressLink(
                                            getSelectedNetworkConfig(),
                                            fields.creator,
                                        )}
                                        target="_blank"
                                        rel="noreferrer"
                                        title={fields.creator}
                                    >
                                        {fields.creator}
                                    </a>
                                    {#if isCreator}
                                        <span class="you-badge">you</span>
                                    {/if}
                                </span>
                            </div>
                        </div>

                        <!-- User actions -->
                        {#if $activeAddress && $activeAddress !== '0x'}
                            {#if myDeposits.length > 0}
                                <div class="my-deposits">
                                    Your deposits: <strong>{formatIota(myTotal)} IOTA</strong>
                                    ({myDeposits.length} deposit{myDeposits.length > 1 ? 's' : ''})
                                </div>
                            {/if}

                            <div class="card-actions">
                                <div class="action-row" style="justify-content: space-between;">
                                    <div class="action-row">
                                        {#if stakedObjects.length > 0}
                                            <select bind:value={selectedStakes[pool.objectId]}>
                                                <option value=""
                                                    >Select StakedIota to deposit...</option
                                                >
                                                {#each stakedObjects as s}
                                                    <option value={s.objectId}>
                                                        {formatAddress(s.objectId)} — {formatIota(
                                                            s.principal,
                                                        )} IOTA
                                                    </option>
                                                {/each}
                                            </select>
                                            <button
                                                onclick={() => deposit(pool.objectId)}
                                                disabled={!selectedStakes[pool.objectId] ||
                                                    isPending}
                                                title="Add your StakedIota to this pool"
                                            >
                                                Deposit
                                            </button>
                                        {:else}
                                            <span class="action-hint">
                                                No StakedIota in wallet — stake IOTA to a validator
                                                first
                                            </span>
                                        {/if}
                                    </div>
                                    {#if myDeposits.length > 0}
                                        <button
                                            class="secondary"
                                            onclick={() => withdraw(pool.objectId)}
                                            disabled={isPending}
                                            title="Returns all your deposited StakedIota back to your wallet"
                                        >
                                            Withdraw All ({formatIota(myTotal)} IOTA)
                                        </button>
                                    {/if}
                                </div>

                                <div class="admin-actions">
                                    <div class="action-row">
                                        <button
                                            class="secondary"
                                            onclick={() => destroyEmpty(pool.objectId)}
                                            disabled={fields.deposits.length > 0 || isPending}
                                            title={fields.deposits.length > 0
                                                ? 'Pool still has deposits — withdraw or cancel first'
                                                : 'Clean up this empty pool object'}
                                        >
                                            Destroy Empty
                                        </button>
                                        <span class="admin-label">Creator only:</span>
                                        <button
                                            onclick={() => executeRestake(pool.objectId)}
                                            disabled={!isCreator || !isReady || isPending}
                                            title={!isCreator
                                                ? 'Only the pool creator can execute'
                                                : isReady
                                                  ? 'Unstake all deposits and restake to the target validator'
                                                  : `${formatIota(thresholdNanos - totalPrincipal)} IOTA still needed`}
                                        >
                                            {isReady
                                                ? 'Restake to Target Validator'
                                                : `Restake (${formatIota(thresholdNanos - totalPrincipal)} IOTA remaining)`}
                                        </button>
                                        <button
                                            class="danger"
                                            onclick={() => cancelPool(pool.objectId)}
                                            disabled={!isCreator || isPending}
                                            title={isCreator
                                                ? 'Return all deposits to their owners and destroy this pool'
                                                : 'Only the pool creator can cancel'}
                                        >
                                            Cancel Pool
                                        </button>
                                    </div>
                                </div>
                            </div>
                        {/if}

                        {#if poolTxResults[pool.objectId]}
                            <div class="pool-tx-result">
                                <TransactionView value={poolTxResults[pool.objectId]} />
                            </div>
                        {/if}
                        {#if poolErrors[pool.objectId]}
                            <p class="error-text">{poolErrors[pool.objectId]}</p>
                        {/if}
                    </div>
                {/each}
            </div>
        {/if}

        <!-- Create Pool -->
        <div class="section">
            <h3 class="section-title">Create Pool</h3>
            {#if !$activeAddress || $activeAddress === '0x'}
                <p class="muted">Select a signer above to create a pool.</p>
            {:else if loadingCandidates}
                <p class="muted">Loading candidates...</p>
            {:else if availableCandidates.length > 0}
                <div class="form-row">
                    <select bind:value={newPoolValidator}>
                        <option value="">Select candidate validator...</option>
                        {#each availableCandidates as v}
                            <option value={v.iotaAddress}>
                                {v.name} ({formatAddress(v.iotaAddress)})
                            </option>
                        {/each}
                    </select>
                    <button onclick={createPool} disabled={!newPoolValidator || createPending}>
                        {createPending ? 'Creating...' : 'Create'}
                    </button>
                </div>
            {:else if candidateValidators.length > 0}
                <p class="muted">All candidate validators already have a pool.</p>
            {:else}
                <p class="muted">No candidate validators found on this network.</p>
            {/if}
            {#if createTxResult}
                <TransactionView value={createTxResult} />
            {/if}
            {#if createError}
                <p class="error-text">{createError}</p>
            {/if}
        </div>

        <!-- FAQ -->
        <details class="faq-section">
            <summary>FAQ</summary>
            <dl>
                <dt>What do I need to deposit?</dt>
                <dd>
                    You need existing <code>StakedIota</code> objects in your wallet. These are obtained
                    by staking IOTA to any validator. You deposit these objects into a pool — they stay
                    staked to their original validator until the pool executes.
                </dd>

                <dt>Can I withdraw my deposit?</dt>
                <dd>
                    Yes, at any time before the pool is executed. Your <code>StakedIota</code>
                    objects are returned directly to your wallet. Withdrawal is all-or-nothing.
                </dd>

                <dt>What happens when the threshold is reached?</dt>
                <dd>
                    Once total deposits reach 2,000,000 IOTA, the pool creator can trigger the
                    restaking. All deposits are unstaked and restaked to the target candidate
                    validator. Each depositor receives their new <code>StakedIota</code> back (including
                    any accrued rewards).
                </dd>

                <dt>How much staking reward do I miss?</dt>
                <dd>
                    Your deposits remain staked until execution, so you keep earning rewards. During
                    the restaking transition you miss one epoch of rewards.
                </dd>

                <dt>What happens if the pool is full (1,000 deposits)?</dt>
                <dd>
                    You can still deposit — but only if your deposit is strictly larger than the
                    current smallest deposit. The smallest deposit gets evicted.
                </dd>

                <dt>Who can cancel a pool?</dt>
                <dd>
                    Only the pool creator. Cancelling returns all deposits and destroys the pool.
                </dd>

                <dt>What does "Destroy Empty" do?</dt>
                <dd>
                    It cleans up a pool object that has no deposits left. It does not move any funds
                    — it simply deletes the empty on-chain object.
                </dd>
            </dl>
        </details>
    {:else}
        <p class="muted" style="text-align: center; padding: 2rem;">
            Enter a package ID above to get started.
        </p>
    {/if}
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
        padding: 0;
        max-width: 720px;
        margin: 0 auto;
    }

    @media (min-width: 768px) {
        .container {
            padding: 0.25rem 0;
        }
    }

    .info-section {
        background: var(--background-card);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        overflow: hidden;
    }

    .info-section summary {
        padding: 0.5rem 0.75rem;
        cursor: pointer;
        font-size: 0.85rem;
        font-weight: 500;
    }

    .info-section summary:hover {
        background: rgba(255, 255, 255, 0.03);
    }

    .intro-text {
        font-size: 0.82rem;
        color: var(--text-muted);
        line-height: 1.5;
        padding: 0.5rem 0.75rem;
        border-top: 1px solid var(--border-color);
        margin: 0;
    }

    .intro-text a {
        color: #6c8cff;
        font-weight: 500;
    }

    .intro-text code {
        color: rgba(255, 255, 255, 0.85);
        background: rgba(255, 255, 255, 0.08);
        padding: 0.1rem 0.35rem;
        border-radius: 3px;
        font-size: 0.78rem;
    }

    .flow-picture {
        display: block;
        padding: 0.5rem 0.75rem;
        border-top: 1px solid var(--border-color);
        cursor: zoom-in;
    }

    .flow-diagram {
        width: 100%;
        border-radius: 6px;
    }

    .lightbox {
        position: fixed;
        inset: 0;
        z-index: 1000;
        background: rgba(0, 0, 0, 0.85);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: zoom-out;
        padding: 2rem;
    }

    .lightbox img {
        display: block;
        max-width: 100%;
        max-height: 100%;
    }

    .pkg-link {
        font-family: monospace;
        font-size: 0.82rem;
        color: #6c8cff;
        font-weight: 400;
    }

    .muted {
        color: var(--text-muted);
        font-size: 0.85rem;
    }

    .error-text {
        color: #f87171;
        font-size: 0.82rem;
        margin-top: 0.3rem;
    }

    .section {
        margin-bottom: 0.15rem;
    }

    .section-title {
        font-size: 0.9rem;
        font-weight: 600;
        color: var(--text-muted);
        margin-bottom: 0.3rem;
    }

    .form-row {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        flex-wrap: wrap;
    }

    .form-row select {
        background: #0d1117;
        border: 1px solid var(--border-color);
        color: white;
        padding: 0.4rem 0.6rem;
        border-radius: 4px;
        font-size: 0.85rem;
    }

    .form-row select option {
        background: #0d1117;
        color: white;
    }

    /* Pool card */
    .pool-card {
        background: var(--background-card);
        border: 1px solid var(--border-color);
        border-radius: 6px;
        padding: 0.5rem 0.65rem;
        margin-bottom: 0.35rem;
    }

    .progress-bar {
        height: 4px;
        background: var(--border-color);
        border-radius: 2px;
        margin: 0.2rem 0 0.35rem;
        overflow: hidden;
    }

    .progress-bar .fill {
        height: 100%;
        background: #6c8cff;
        border-radius: 3px;
        transition: width 0.3s;
    }

    .progress-bar .fill.complete {
        background: #4ade80;
    }

    .pool-details {
        display: flex;
        flex-direction: column;
        gap: 0.1rem;
        font-size: 0.82rem;
        margin-bottom: 0.3rem;
    }

    .details-heading-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .details-heading {
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.03em;
        text-align: left;
        align-self: flex-start;
    }

    .detail-row {
        display: flex;
        align-items: center;
        gap: 0.4rem;
    }

    .detail-label {
        color: var(--text-muted);
        font-size: 0.78rem;
        min-width: 10rem;
        flex-shrink: 0;
        text-align: left;
    }

    .detail-value {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        min-width: 0;
        overflow-wrap: break-word;
        word-break: break-all;
    }

    .detail-value a {
        color: var(--accent-color);
        font-family: monospace;
        font-size: 0.8rem;
        font-weight: 400;
        padding: 0;
        margin: 0;
        word-break: break-all;
    }

    .you-badge {
        font-size: 0.7rem;
        padding: 0.05rem 0.35rem;
        background: rgba(108, 140, 255, 0.15);
        color: #6c8cff;
        border-radius: 3px;
        font-weight: 600;
        white-space: nowrap;
        flex-shrink: 0;
    }

    /* Badge */
    .badge {
        display: inline-block;
        padding: 0.15rem 0.5rem;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 600;
        white-space: nowrap;
    }

    .badge.ready {
        background: rgba(74, 222, 128, 0.15);
        color: #4ade80;
    }

    .badge.pending {
        background: rgba(108, 140, 255, 0.15);
        color: #6c8cff;
    }

    /* My deposits */
    .my-deposits {
        margin-top: 0.25rem;
        font-size: 0.82rem;
        padding: 0.25rem 0.5rem;
        background: rgba(255, 255, 255, 0.03);
        border-radius: 4px;
    }

    /* Actions */
    .card-actions {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        margin-top: 0.35rem;
        padding-top: 0.35rem;
        border-top: 1px solid var(--border-color);
    }

    .action-row {
        display: flex;
        gap: 0.35rem;
        align-items: center;
        flex-wrap: wrap;
    }

    .action-row select {
        background: #0d1117;
        border: 1px solid var(--border-color);
        color: white;
        padding: 0.3rem 0.5rem;
        border-radius: 4px;
        font-size: 0.8rem;
    }

    .action-row select option {
        background: #0d1117;
        color: white;
    }

    .action-row button {
        font-size: 0.8rem;
        padding: 0.3rem 0.6rem;
    }

    .admin-actions {
        margin-top: 0.2rem;
        padding-top: 0.2rem;
        border-top: 1px dashed var(--border-color);
    }

    .admin-label {
        font-size: 0.7rem;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.03em;
    }

    .action-hint {
        font-size: 0.8rem;
        color: var(--text-muted);
        font-style: italic;
    }

    button.secondary {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid var(--border-color);
    }

    .pool-tx-result {
        margin-top: 0.3rem;
    }

    /* FAQ */
    .faq-section {
        background: var(--background-card);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        overflow: hidden;
    }

    .faq-section summary {
        padding: 0.5rem 0.75rem;
        cursor: pointer;
        font-size: 0.85rem;
        font-weight: 500;
    }

    .faq-section summary:hover {
        background: rgba(255, 255, 255, 0.03);
    }

    .faq-section dl {
        padding: 0.25rem 0.75rem 0.5rem;
        border-top: 1px solid var(--border-color);
    }

    .faq-section dt {
        font-weight: 600;
        font-size: 0.84rem;
        margin-top: 0.6rem;
    }

    .faq-section dt:first-child {
        margin-top: 0.25rem;
    }

    .faq-section dd {
        margin: 0.15rem 0 0;
        font-size: 0.82rem;
        color: var(--text-muted);
        line-height: 1.45;
    }

    .faq-section code {
        color: rgba(255, 255, 255, 0.85);
        background: rgba(255, 255, 255, 0.08);
        padding: 0.1rem 0.35rem;
        border-radius: 3px;
        font-size: 0.78rem;
    }
</style>

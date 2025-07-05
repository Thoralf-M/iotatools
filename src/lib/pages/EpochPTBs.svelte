<script lang="ts">
    import { onMount } from 'svelte';

    import TransactionChart from '../components/TransactionChart.svelte';
    import TransactionView from '../components/TransactionView.svelte';
    import { EpochPTBAnalyzer, type DisplayData } from '../epoch-ptb-analyzer';

    let epoch = '';
    let startCheckpoint = '';
    let endCheckpoint = '';
    let transactionLimit = 10;
    let loading = false;
    let epochLoading = false;
    let error = '';
    let inputMode: 'epoch' | 'checkpoint' = 'epoch'; // Track which input mode is selected
    let isLimitedQuery = false;
    let processedTransactions = 0;
    let processedCheckpoints = 0;
    let totalCheckpoints = 0;
    let selectedCheckpoint = '';
    let checkpointTransactions: any[] = [];
    let loadingCheckpointTransactions = false;
    let stopRequested = false; // Track if user requested to stop fetching

    let displayData: DisplayData = {
        totalPTBs: 0,
        failedPTBs: 0,
        uniqueSendersCount: 0,
        calledPackagesCount: 0,
        calledFunctionsCount: 0,
        publishedPackagesCount: 0,
        uniqueSendersList: [],
        calledPackagesList: [],
        calledFunctionsList: [],
        publishedPackagesList: [],
        checkpointRange: null,
        checkpointData: [],
        transactionsByCheckpoint: new Map(),
    };

    const analyzer = new EpochPTBAnalyzer();

    // Clear opposite input values when switching modes
    $: if (inputMode === 'epoch') {
        startCheckpoint = '';
        endCheckpoint = '';
    } else if (inputMode === 'checkpoint') {
        epoch = '';
    }

    // Calculate checkpoint counts for display
    $: epochCheckpointCount =
        epoch && epoch.toString().trim() !== '' && displayData.checkpointRange
            ? displayData.checkpointRange.last - displayData.checkpointRange.first + 1
            : null;

    $: checkpointRangeCount =
        startCheckpoint &&
        endCheckpoint &&
        startCheckpoint.toString().trim() !== '' &&
        endCheckpoint.toString().trim() !== ''
            ? parseInt(endCheckpoint) - parseInt(startCheckpoint) + 1
            : null;

    async function getCurrentEpoch() {
        try {
            epochLoading = true;
            const currentEpochId = await analyzer.getCurrentEpoch();
            if (currentEpochId) {
                epoch = currentEpochId;
                console.log('Current epoch:', currentEpochId);

                // Also fetch the checkpoint range for this epoch to show checkpoint count
                try {
                    const range = await analyzer.getCheckpointRangeForEpoch(
                        parseInt(currentEpochId),
                    );
                    if (range) {
                        displayData = {
                            ...displayData,
                            checkpointRange: range,
                        };
                        console.log('Current epoch checkpoint range:', range);
                    }
                } catch (rangeErr: any) {
                    console.error('Error fetching checkpoint range for current epoch:', rangeErr);
                }
            } else {
                // Fallback to a recent epoch if current epoch fetch fails
                epoch = '223';
            }
        } catch (err: any) {
            console.error('Error fetching current epoch:', err);
            // Fallback to a recent epoch if current epoch fetch fails
            epoch = '223';
        } finally {
            epochLoading = false;
        }
    }

    async function getCurrentEpochRange() {
        try {
            epochLoading = true;
            const currentEpochId = await analyzer.getCurrentEpoch();
            if (currentEpochId) {
                // Fetch the checkpoint range for the current epoch
                const range = await analyzer.getCheckpointRangeForEpoch(parseInt(currentEpochId));
                if (range) {
                    startCheckpoint = range.first.toString();
                    endCheckpoint = range.last.toString();
                    console.log('Current epoch checkpoint range:', range);
                }
            }
        } catch (err: any) {
            console.error('Error fetching current epoch range:', err);
            // Fallback values if needed
            startCheckpoint = '';
            endCheckpoint = '';
        } finally {
            epochLoading = false;
        }
    }

    onMount(() => {
        getCurrentEpoch();
    });

    function stopFetching() {
        stopRequested = true;
        // The analyzer will check this flag during processing
        analyzer.requestStop();
    }

    async function fetchEpochTransactionBlocks() {
        // Validate input based on selected mode
        if (inputMode === 'epoch') {
            if (!epoch || epoch.toString().trim() === '') {
                error = 'Please enter an epoch number';
                return;
            }
        } else {
            if (
                !startCheckpoint ||
                !endCheckpoint ||
                startCheckpoint.toString().trim() === '' ||
                endCheckpoint.toString().trim() === ''
            ) {
                error = 'Please enter both start and end checkpoint numbers';
                return;
            }
        }

        const hasEpoch = inputMode === 'epoch' && epoch && epoch.toString().trim() !== '';
        const hasCheckpointRange =
            inputMode === 'checkpoint' &&
            startCheckpoint.toString().trim() !== '' &&
            endCheckpoint.toString().trim() !== '';

        loading = true;
        isLimitedQuery = false;
        stopRequested = false;
        error = '';
        processedTransactions = 0;
        processedCheckpoints = 0;
        totalCheckpoints = 0;
        selectedCheckpoint = '';
        checkpointTransactions = [];

        // Reset display data
        displayData = {
            totalPTBs: 0,
            failedPTBs: 0,
            uniqueSendersCount: 0,
            calledPackagesCount: 0,
            calledFunctionsCount: 0,
            publishedPackagesCount: 0,
            uniqueSendersList: [],
            calledPackagesList: [],
            calledFunctionsList: [],
            publishedPackagesList: [],
            checkpointRange: null,
            checkpointData: [],
            transactionsByCheckpoint: new Map(),
        };

        try {
            await analyzer.fetchAllTransactionBlocks(
                hasEpoch ? epoch : undefined,
                hasCheckpointRange ? startCheckpoint : undefined,
                hasCheckpointRange ? endCheckpoint : undefined,
                (data, complete, processed, processedCp, totalCp) => {
                    displayData = data;
                    processedTransactions = processed;
                    processedCheckpoints = processedCp;
                    totalCheckpoints = totalCp;

                    // Auto-populate checkpoint fields if using epoch
                    if (hasEpoch && data.checkpointRange) {
                        startCheckpoint = data.checkpointRange.first.toString();
                        endCheckpoint = data.checkpointRange.last.toString();
                    }

                    // Auto-select the first checkpoint with transactions
                    if (complete && data.checkpointData.length > 0 && !selectedCheckpoint) {
                        const firstCheckpointWithTxs = data.checkpointData.find(
                            (cp) => cp.transactionCount > 0,
                        );
                        if (firstCheckpointWithTxs) {
                            selectedCheckpoint = firstCheckpointWithTxs.sequenceNumber.toString();
                            fetchCheckpointTransactions(selectedCheckpoint);
                        }
                    }
                },
            );
        } catch (err: any) {
            if (stopRequested) {
                console.log('Fetch stopped by user request');
                // Don't show error for user-requested stops
            } else {
                error = err.toString();
                console.error('Error fetching epoch transaction blocks:', err);
            }
        } finally {
            loading = false;
            stopRequested = false; // Reset stop flag when done
        }
    }

    async function fetchLimitedTransactionBlocks() {
        // Validate input based on selected mode
        if (inputMode === 'epoch') {
            if (!epoch || epoch.toString().trim() === '') {
                error = 'Please enter an epoch number';
                return;
            }
        } else {
            if (
                !startCheckpoint ||
                !endCheckpoint ||
                startCheckpoint.toString().trim() === '' ||
                endCheckpoint.toString().trim() === ''
            ) {
                error = 'Please enter both start and end checkpoint numbers';
                return;
            }
        }

        const hasEpoch = inputMode === 'epoch' && epoch && epoch.toString().trim() !== '';
        const hasCheckpointRange =
            inputMode === 'checkpoint' &&
            startCheckpoint.toString().trim() !== '' &&
            endCheckpoint.toString().trim() !== '';

        loading = true;
        isLimitedQuery = true;
        stopRequested = false;
        error = '';
        processedTransactions = 0;
        processedCheckpoints = 0;
        totalCheckpoints = 0;
        selectedCheckpoint = '';
        checkpointTransactions = [];

        // Reset display data
        displayData = {
            totalPTBs: 0,
            failedPTBs: 0,
            uniqueSendersCount: 0,
            calledPackagesCount: 0,
            calledFunctionsCount: 0,
            publishedPackagesCount: 0,
            uniqueSendersList: [],
            calledPackagesList: [],
            calledFunctionsList: [],
            publishedPackagesList: [],
            checkpointRange: null,
            checkpointData: [],
            transactionsByCheckpoint: new Map(),
        };

        try {
            await analyzer.fetchLimitedTransactionBlocks(
                transactionLimit,
                hasEpoch ? epoch : undefined,
                hasCheckpointRange ? startCheckpoint : undefined,
                hasCheckpointRange ? endCheckpoint : undefined,
                (data, complete, processed, processedCp, totalCp) => {
                    displayData = data;
                    processedTransactions = processed;
                    processedCheckpoints = processedCp;
                    totalCheckpoints = totalCp;

                    // Auto-populate checkpoint fields if using epoch
                    if (hasEpoch && data.checkpointRange) {
                        startCheckpoint = data.checkpointRange.first.toString();
                        endCheckpoint = data.checkpointRange.last.toString();
                    }

                    // Auto-select the first checkpoint with transactions
                    if (complete && data.checkpointData.length > 0 && !selectedCheckpoint) {
                        const firstCheckpointWithTxs = data.checkpointData.find(
                            (cp) => cp.transactionCount > 0,
                        );
                        if (firstCheckpointWithTxs) {
                            selectedCheckpoint = firstCheckpointWithTxs.sequenceNumber.toString();
                            fetchCheckpointTransactions(selectedCheckpoint);
                        }
                    }
                },
            );
        } catch (err: any) {
            if (stopRequested) {
                console.log('Limited fetch stopped by user request');
                // Don't show error for user-requested stops
            } else {
                error = err.toString();
                console.error('Error fetching limited epoch transaction blocks:', err);
            }
        } finally {
            loading = false;
            stopRequested = false; // Reset stop flag when done
        }
    }

    function formatAddress(address: string): string {
        if (!address) return '';
        return `${address.slice(0, 8)}...${address.slice(-6)}`;
    }

    function copyToClipboard(text: string) {
        navigator.clipboard.writeText(text);
    }

    function handleCheckpointSelection(checkpoint: string) {
        selectedCheckpoint = checkpoint;
        fetchCheckpointTransactions(selectedCheckpoint);
    }

    function fetchCheckpointTransactions(checkpoint: string) {
        if (!checkpoint || checkpoint.trim() === '') {
            checkpointTransactions = [];
            return;
        }

        loadingCheckpointTransactions = true;
        try {
            const transactions = analyzer.getCheckpointTransactions(checkpoint, displayData);
            checkpointTransactions = transactions || [];
        } catch (err) {
            console.error('Error fetching checkpoint transactions:', err);
            checkpointTransactions = [];
        } finally {
            loadingCheckpointTransactions = false;
        }
    }

    function onCheckpointInputChange() {
        const checkpointStr = String(selectedCheckpoint || '').trim();
        if (checkpointStr !== '') {
            fetchCheckpointTransactions(checkpointStr);
        } else {
            checkpointTransactions = [];
        }
    }

    function toggleTransactionIds(event: Event) {
        const detailsElement = event.target as HTMLDetailsElement;
        const functionItem = detailsElement.closest('.function-item');
        const transactionSection = functionItem?.querySelector('.transaction-ids-section');

        if (transactionSection) {
            if (detailsElement.open) {
                transactionSection.classList.add('show');
            } else {
                transactionSection.classList.remove('show');
            }
        }
    }
</script>

<div class="epoch-transaction-blocks">
    <p>Query programmable transaction blocks data for a specific epoch or checkpoint range</p>

    <div class="input-section">
        <div class="input-row-single">
            <div class="mode-selection-column">
                <label class="mode-option-stacked">
                    <span class="mode-label-stacked">Epoch Number</span>
                    <input
                        type="radio"
                        bind:group={inputMode}
                        value="epoch"
                        disabled={loading || epochLoading}
                    />
                </label>
                <label class="mode-option-stacked">
                    <span class="mode-label-stacked">Checkpoint Range</span>
                    <input
                        type="radio"
                        bind:group={inputMode}
                        value="checkpoint"
                        disabled={loading}
                    />
                </label>
            </div>

            <div class="input-controls">
                {#if inputMode === 'epoch'}
                    <input
                        id="epoch-input"
                        type="number"
                        bind:value={epoch}
                        placeholder="Epoch"
                        min="0"
                        disabled={loading || epochLoading}
                        style="width: 7rem;"
                    />
                    <button
                        class="fetch-current-epoch-btn"
                        on:click={getCurrentEpoch}
                        disabled={loading || epochLoading}
                        title="Fetch current epoch"
                    >
                        {#if epochLoading}
                            Loading...
                        {:else}
                            Get Current
                        {/if}
                    </button>
                    {#if epochCheckpointCount}
                        <span class="checkpoint-count"
                            >({epochCheckpointCount.toLocaleString()} checkpoints)</span
                        >
                    {/if}
                {:else}
                    <input
                        id="start-checkpoint"
                        type="number"
                        bind:value={startCheckpoint}
                        placeholder="Start"
                        min="0"
                        disabled={loading}
                        style="width: 8rem;"
                    />
                    <span class="range-separator">to</span>
                    <input
                        id="end-checkpoint"
                        type="number"
                        bind:value={endCheckpoint}
                        placeholder="End"
                        min="0"
                        disabled={loading}
                        style="width: 8rem;"
                    />
                    <button
                        class="fetch-current-epoch-btn"
                        on:click={getCurrentEpochRange}
                        disabled={loading || epochLoading}
                        title="Fetch current epoch range"
                    >
                        {#if epochLoading}
                            Loading...
                        {:else}
                            Get Current
                        {/if}
                    </button>
                    {#if checkpointRangeCount && checkpointRangeCount > 0}
                        <span class="checkpoint-count"
                            >({checkpointRangeCount.toLocaleString()} checkpoints)</span
                        >
                    {/if}
                {/if}
            </div>
        </div>

        <div class="button-row">
            <button
                on:click={fetchEpochTransactionBlocks}
                disabled={loading ||
                    (inputMode === 'epoch' && !epoch) ||
                    (inputMode === 'checkpoint' && (!startCheckpoint || !endCheckpoint)) ||
                    epochLoading}
            >
                {loading ? 'Loading...' : 'Query All Data'}
            </button>
            <div class="input-group">
                <label for="transaction-limit">Limit to:</label>
                <input
                    id="transaction-limit"
                    type="number"
                    bind:value={transactionLimit}
                    placeholder="Max transactions"
                    min="1"
                    disabled={loading}
                    style="width: 6rem;"
                />
            </div>
            <button
                on:click={fetchLimitedTransactionBlocks}
                disabled={loading ||
                    (inputMode === 'epoch' && !epoch) ||
                    (inputMode === 'checkpoint' && (!startCheckpoint || !endCheckpoint)) ||
                    epochLoading ||
                    !transactionLimit ||
                    transactionLimit <= 0}
            >
                {loading ? 'Loading...' : `Query Limited (${transactionLimit})`}
            </button>
        </div>
    </div>

    {#if error}
        <div class="error">
            <strong>Error:</strong>
            {error}
        </div>
    {/if}

    {#if loading}
        <div class="loading">
            {#if isLimitedQuery}
                {#if inputMode === 'epoch'}
                    <p>Fetching up to {transactionLimit} transaction blocks for epoch {epoch}...</p>
                {:else}
                    <p>
                        Fetching up to {transactionLimit} transaction blocks for checkpoint range {startCheckpoint}
                        - {endCheckpoint}...
                    </p>
                {/if}
                <p><em>This query will stop after finding {transactionLimit} transactions.</em></p>
            {:else}
                {#if inputMode === 'epoch'}
                    <p>Fetching all transaction blocks for epoch {epoch}...</p>
                {:else}
                    <p>
                        Fetching all transaction blocks for checkpoint range {startCheckpoint} - {endCheckpoint}...
                    </p>
                {/if}
                <p><em>This may take a while for large ranges with many transactions.</em></p>
            {/if}
            {#if processedTransactions > 0}
                <div class="progress-info">
                    <div class="progress-header">
                        <p>
                            <strong>Progress:</strong>
                            {processedTransactions.toLocaleString()} transactions processed
                        </p>
                        <button
                            class="stop-btn"
                            on:click={stopFetching}
                            disabled={stopRequested}
                            title="Stop fetching data"
                        >
                            {stopRequested ? 'Stopping...' : 'Stop'}
                        </button>
                    </div>
                    {#if totalCheckpoints > 0}
                        <div class="progress-section">
                            <div class="progress-label">
                                <span
                                    >Checkpoints: {processedCheckpoints.toLocaleString()} / {totalCheckpoints.toLocaleString()}</span
                                >
                                <span class="progress-percentage"
                                    >{Math.round(
                                        (processedCheckpoints / totalCheckpoints) * 100,
                                    )}%</span
                                >
                            </div>
                            <div class="progress-bar">
                                <div
                                    class="progress-fill"
                                    style="width: {Math.round(
                                        (processedCheckpoints / totalCheckpoints) * 100,
                                    )}%"
                                ></div>
                            </div>
                        </div>
                    {/if}
                </div>
            {/if}
        </div>
    {/if}

    {#if displayData.totalPTBs > 0}
        <div class="results">
            {#if inputMode === 'epoch'}
                <h3>Epoch {epoch} Summary</h3>
            {:else}
                <h3>Checkpoint Range {startCheckpoint} - {endCheckpoint} Summary</h3>
            {/if}

            {#if displayData.checkpointRange}
                <div class="checkpoint-info">
                    <p>
                        <strong>Checkpoint Range:</strong>
                        {displayData.checkpointRange.first.toLocaleString()} - {displayData.checkpointRange.last.toLocaleString()},
                        total: {(
                            displayData.checkpointRange.last -
                            displayData.checkpointRange.first +
                            1
                        ).toLocaleString()} checkpoints
                    </p>
                </div>
            {/if}

            <div class="summary-cards">
                <div class="summary-card">
                    <h4>Total PTBs</h4>
                    <div class="metric">{displayData.totalPTBs.toLocaleString()}</div>
                    Failed: {displayData.failedPTBs}
                </div>

                <div class="summary-card">
                    <h4>Unique Senders</h4>
                    <div class="metric">{displayData.uniqueSendersCount.toLocaleString()}</div>
                </div>

                <div class="summary-card">
                    <h4>Called Functions</h4>
                    <div class="metric">{displayData.calledFunctionsCount.toLocaleString()}</div>
                </div>

                <div class="summary-card">
                    <h4>Published Packages</h4>
                    <div class="metric">{displayData.publishedPackagesCount.toLocaleString()}</div>
                </div>
            </div>

            <div class="details-section">
                <details>
                    <summary>Called Functions ({displayData.calledFunctionsCount})</summary>
                    <div class="function-list">
                        {#each displayData.calledFunctionsList as func}
                            <div class="function-item">
                                <div class="function-header">
                                    <div class="function-signature">
                                        <div class="function-parts">
                                            <span class="package-id" title={func.package}
                                                >{func.package}</span
                                            ><span class="separator">::</span><span class="module"
                                                >{func.module}</span
                                            ><span class="separator">::</span><span
                                                class="function-name">{func.function}</span
                                            >
                                            <button
                                                class="copy-btn"
                                                style="padding: 4px 8px; font-size: 13px;"
                                                on:click={() => copyToClipboard(func.fullName)}
                                                title="Copy full function signature"
                                            >
                                                📋
                                            </button>
                                        </div>
                                        <div class="function-actions">
                                            <details on:toggle={toggleTransactionIds}>
                                                <summary>Txs</summary>
                                            </details>
                                        </div>
                                    </div>
                                    <div class="function-stats">
                                        <div class="call-count">
                                            <span class="count-label">Calls:</span>
                                            <span class="count-value"
                                                >{func.callCount.toLocaleString()}</span
                                            >
                                        </div>
                                        <div class="tx-count">
                                            <span class="count-label">Txs:</span>
                                            <span class="count-value"
                                                >{func.transactionIds.length.toLocaleString()}</span
                                            >
                                        </div>
                                    </div>
                                </div>
                                <div class="transaction-ids-section">
                                    <div class="transaction-ids-list">
                                        {#each func.transactionIds as txId}
                                            <div class="transaction-id-item">
                                                <span class="tx-id" title={txId}
                                                    >{formatAddress(txId)}</span
                                                >
                                                <button
                                                    class="copy-btn"
                                                    style="padding: 4px 8px; align-self: center;"
                                                    on:click={() => copyToClipboard(txId)}
                                                    title="Copy transaction ID"
                                                >
                                                    📋
                                                </button>
                                            </div>
                                        {/each}
                                    </div>
                                </div>
                            </div>
                        {/each}
                    </div>
                </details>

                <details>
                    <summary>Unique Sender Addresses ({displayData.uniqueSendersCount})</summary>
                    <div class="address-list">
                        {#each displayData.uniqueSendersList as sender}
                            <div class="address-item">
                                <div class="address-header">
                                    <div class="address-left">
                                        <div class="address-info">
                                            <span>{sender.address}</span>
                                        </div>
                                        <button
                                            class="copy-btn"
                                            style="padding: 4px 8px; align-self: center;"
                                            on:click={() => copyToClipboard(sender.address)}
                                            title="Copy address"
                                        >
                                            📋
                                        </button>
                                    </div>
                                    <div class="address-stats">
                                        <div class="tx-count">
                                            <span class="count-label">TXs:</span>
                                            <span class="count-value"
                                                >{sender.txCount.toLocaleString()}</span
                                            >
                                        </div>
                                    </div>
                                </div>
                            </div>
                        {/each}
                    </div>
                </details>

                <details>
                    <summary>Called Packages ({displayData.calledPackagesCount})</summary>
                    <div class="address-list">
                        {#each displayData.calledPackagesList as pkg}
                            <div class="address-item">
                                <div class="address-header">
                                    <div class="address-left">
                                        <div class="address-info">
                                            <span>{pkg.package}</span>
                                        </div>
                                        <button
                                            class="copy-btn"
                                            style="padding: 4px 8px; align-self: center;"
                                            on:click={() => copyToClipboard(pkg.package)}
                                            title="Copy address"
                                        >
                                            📋
                                        </button>
                                    </div>
                                    <div class="address-stats">
                                        <div class="call-count">
                                            <span class="count-label">Calls:</span>
                                            <span class="count-value"
                                                >{pkg.callCount.toLocaleString()}</span
                                            >
                                        </div>
                                    </div>
                                </div>
                            </div>
                        {/each}
                    </div>
                </details>

                <details>
                    <summary>Published Packages ({displayData.publishedPackagesCount})</summary>
                    <div class="package-list">
                        {#each displayData.publishedPackagesList as pkg}
                            <div class="package-item">
                                <div class="package-left">
                                    <div class="package-header">
                                        <div class="package-info">
                                            <div class="package-id-row">
                                                <span class="package-label">Package:</span>
                                                <span class="package-id">{pkg.packageId}</span>
                                                <button
                                                    class="copy-btn"
                                                    style="padding: 4px 8px; align-self: center;"
                                                    on:click={() => copyToClipboard(pkg.packageId)}
                                                    title="Copy package ID"
                                                >
                                                    📋
                                                </button>
                                            </div>
                                            {#if pkg.modules && pkg.modules.length > 0}
                                                <div class="modules-row">
                                                    <span class="modules-label">Modules:</span>
                                                    <div class="modules-list">
                                                        {#each pkg.modules as moduleName}
                                                            <span class="module-name"
                                                                >{moduleName}</span
                                                            >
                                                        {/each}
                                                    </div>
                                                </div>
                                            {/if}
                                            <div class="sender-row">
                                                <span class="sender-label">Sender:</span>
                                                <span class="sender-address">{pkg.sender}</span>
                                                <button
                                                    class="copy-btn"
                                                    style="padding: 4px 8px; align-self: center;"
                                                    on:click={() => copyToClipboard(pkg.sender)}
                                                    title="Copy sender address"
                                                >
                                                    📋
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="package-meta">
                                    <div class="version-info">
                                        <span class="version-label">v{pkg.version}</span>
                                    </div>
                                    <button
                                        class="copy-btn tx-btn"
                                        on:click={() => copyToClipboard(pkg.txId)}
                                        title="Copy transaction ID: {formatAddress(pkg.txId)}"
                                    >
                                        TX
                                    </button>
                                </div>
                            </div>
                        {/each}
                    </div>
                </details>
            </div>

            {#if displayData.checkpointData.length > 0 && !loading}
                <TransactionChart
                    checkpointData={displayData.checkpointData}
                    title="Transactions per Checkpoint Over Time"
                    onCheckpointSelected={handleCheckpointSelection}
                />

                <div class="checkpoint-inspector">
                    <h4>Checkpoint Inspector</h4>
                    <div class="checkpoint-input-section">
                        <label for="checkpoint-input">Checkpoint Number:</label>
                        <input
                            id="checkpoint-input"
                            type="number"
                            bind:value={selectedCheckpoint}
                            on:input={onCheckpointInputChange}
                            placeholder="Enter checkpoint number or click on chart"
                            min="0"
                            disabled={loadingCheckpointTransactions}
                        />
                        {#if selectedCheckpoint}
                            <button
                                class="clear-checkpoint-btn"
                                on:click={() => {
                                    selectedCheckpoint = '';
                                    checkpointTransactions = [];
                                }}
                                title="Clear checkpoint selection"
                            >
                                ✕
                            </button>
                        {/if}
                        <h5>
                            Transactions: {checkpointTransactions.length}
                        </h5>
                    </div>

                    {#if loadingCheckpointTransactions}
                        <div class="checkpoint-loading">
                            <p>Loading transactions for checkpoint {selectedCheckpoint}...</p>
                        </div>
                    {:else if selectedCheckpoint && checkpointTransactions.length > 0}
                        <div class="checkpoint-transactions">
                            <div class="transaction-list">
                                {#each checkpointTransactions as tx, index}
                                    <details class="transaction-details">
                                        <summary class="transaction-summary">
                                            <span class="transaction-number"
                                                >Transaction {index + 1}</span
                                            >
                                            {#if tx.digest}
                                                <span class="transaction-digest" title={tx.digest}>
                                                    {tx.digest}
                                                </span>
                                            {:else if tx.transactionDigest}
                                                <span
                                                    class="transaction-digest"
                                                    title={tx.transactionDigest}
                                                >
                                                    {tx.transactionDigest}
                                                </span>
                                            {/if}
                                            {#if tx.effects && tx.effects.status}
                                                <span
                                                    class="transaction-status"
                                                    class:success={tx.effects.status.status ===
                                                        'success'}
                                                    class:failure={tx.effects.status.status ===
                                                        'failure'}
                                                >
                                                    {tx.effects.status.status}
                                                </span>
                                            {/if}
                                        </summary>
                                        <div class="transaction-content">
                                            <TransactionView value={tx} />
                                        </div>
                                    </details>
                                {/each}
                            </div>
                        </div>
                    {:else if selectedCheckpoint && checkpointTransactions.length === 0 && !loadingCheckpointTransactions}
                        <div class="no-transactions">
                            <p>No transactions found for checkpoint {selectedCheckpoint}</p>
                        </div>
                    {:else}
                        <div class="checkpoint-placeholder">
                            <p>
                                Click on a data point in the chart above or enter a checkpoint
                                number to inspect its transactions
                            </p>
                        </div>
                    {/if}
                </div>
            {/if}
        </div>
    {/if}
</div>

<style>
    .epoch-transaction-blocks {
        max-width: 1200px;
        margin: 0 auto;
    }

    .input-section {
        padding: 5px;
        margin: 0;
    }

    .input-row-single {
        display: flex;
        align-items: center;
        gap: 20px;
        margin-bottom: 20px;
        flex-wrap: wrap;
        justify-content: center;
    }

    .mode-selection-column {
        display: flex;
        flex-direction: column;
        gap: 8px;
        align-items: flex-start;
    }

    .mode-option-stacked {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        font-weight: bold;
        white-space: nowrap;
        min-height: 20px;
    }

    .mode-option-stacked input[type='radio'] {
        margin: 0;
        cursor: pointer;
        transform: scale(0.8);
        order: 2;
    }

    .mode-label-stacked {
        color: #cecece;
        font-size: 12px;
        user-select: none;
        cursor: pointer;
        font-weight: bold;
        text-align: left;
        line-height: 1.1;
        order: 1;
        min-width: 90px;
    }

    .input-controls {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: nowrap;
        min-height: 48px;
    }

    .checkpoint-count {
        font-size: 12px;
        color: #666;
        font-style: italic;
        white-space: nowrap;
    }

    .button-row {
        display: flex;
        justify-content: center;
        gap: 15px;
        flex-wrap: wrap;
    }

    .input-group {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        justify-content: center;
    }

    .range-separator {
        color: #666;
        font-weight: bold;
        margin: 0 5px;
    }

    .progress-info {
        margin-top: 15px;
        padding-top: 15px;
        border-top: 1px solid rgba(9, 132, 227, 0.3);
    }

    .progress-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 15px;
        margin-bottom: 10px;
    }

    .progress-header p {
        margin: 0;
        flex: 1;
    }

    .stop-btn {
        padding: 6px 12px;
        border: 1px solid #d63031;
        border-radius: 4px;
        background: #d63031;
        color: white;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
        white-space: nowrap;
        font-weight: bold;
    }

    .stop-btn:hover:not(:disabled) {
        background: #a02622;
        border-color: #a02622;
    }

    .stop-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        background: #999;
        border-color: #999;
    }

    .stop-btn:active:not(:disabled) {
        transform: translateY(1px);
    }

    .progress-section {
        margin: 10px 0;
    }

    .progress-label {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 5px;
        font-size: 14px;
    }

    .progress-percentage {
        font-weight: bold;
        color: #0984e3;
    }

    .progress-bar {
        width: 100%;
        height: 8px;
        background-color: rgba(9, 132, 227, 0.2);
        border-radius: 4px;
        overflow: hidden;
    }

    .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #0984e3, #00b894);
        border-radius: 4px;
        transition: width 0.3s ease;
        min-width: 2px;
    }

    .summary-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin-bottom: 30px;
    }

    .summary-card {
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 20px;
        text-align: center;
    }

    .summary-card h4 {
        margin: 0 0 10px 0;
        color: #b0b0b0;
        font-size: 14px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .metric {
        font-size: 28px;
        font-weight: bold;
        color: #007acc;
    }

    .details-section {
        margin-top: 30px;
    }

    .details-section details {
        margin-bottom: 20px;
        border: 1px solid #88888889;
        border-radius: 8px;
        overflow: hidden;
    }

    .details-section summary {
        padding: 15px;
        cursor: pointer;
        font-weight: bold;
        border-bottom: 1px solid #ddd;
        background: rgba(0, 0, 0, 0.1);
        transition: background-color 0.2s ease;
        list-style: none;
    }

    .details-section summary::-webkit-details-marker {
        display: none;
    }

    .details-section summary::marker {
        display: none;
    }

    .details-section summary:hover {
        background: rgba(0, 120, 204, 0.1);
    }

    .details-section details[open] summary {
        background: rgba(0, 120, 204, 0.15);
    }

    .address-list,
    .function-list {
        padding: 15px;
        max-height: 600px;
        overflow-y: auto;
    }

    .address-item {
        display: flex;
        align-items: center;
        border-bottom: 1px solid #606060;
        font-family: monospace;
        font-size: 13px;
        position: relative;
        padding: 4px 0;
        gap: 8px;
    }

    .function-item {
        border-bottom: 1px solid #606060;
        font-family: monospace;
        font-size: 13px;
        position: relative;
        padding: 4px 0;
    }

    .address-item:last-child,
    .function-item:last-child {
        border-bottom: none;
    }

    .function-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0;
        margin: 0;
    }

    .function-stats {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-shrink: 0;
    }

    .transaction-ids-section {
        margin-left: 0;
        display: none;
    }

    :global(.transaction-ids-section.show) {
        display: block;
    }

    .transaction-ids-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 6px;
        padding: 8px;
        max-height: 200px;
        overflow-y: auto;
        border: 1px solid #adadad;
        border-radius: 4px;
        margin-top: 8px;
    }

    .transaction-id-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 6px;
        padding: 4px 6px;
        border: 1px solid #9a9a9a;
        border-radius: 3px;
        font-size: 10px;
    }

    .tx-id {
        font-family: 'Courier New', monospace;
        flex: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .address-info {
        flex: 1;
        word-break: break-all;
        min-width: 0;
    }

    .address-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex: 1;
        min-width: 0;
    }

    .address-stats {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-shrink: 0;
    }

    .address-left {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .function-signature {
        display: flex;
        font-weight: bold;
        white-space: nowrap;
        flex-wrap: nowrap;
        flex: 1;
        align-items: center;
        margin-right: 8px;
        justify-content: space-between;
    }

    .function-parts {
        display: flex;
        align-items: center;
        font-size: 0;
        line-height: 0;
    }

    .function-parts > * {
        font-size: 13px;
        line-height: normal;
        display: inline;
    }

    .function-parts .copy-btn {
        font-size: 13px !important;
        display: inline-block;
        margin-left: 4px;
        vertical-align: middle;
    }

    .function-actions {
        display: flex;
        align-items: center;
        margin-left: 8px;
    }

    .function-signature > * {
        font-size: 13px; /* Restore font size for child elements */
    }

    .function-actions details {
        margin: 0;
        display: inline-flex;
        align-items: center;
        vertical-align: middle;
        line-height: normal;
    }

    .function-actions details summary {
        cursor: pointer;
        color: #007acc;
        font-size: 12px;
        padding: 2px 8px;
        background: rgba(0, 120, 204, 0.1);
        border-radius: 3px;
        user-select: none;
        font-weight: normal;
        display: inline-flex;
        align-items: center;
        margin: 0;
        line-height: 1.2;
        vertical-align: middle;
        list-style: none;
        height: 20px;
        border: none;
    }

    .function-actions details summary::-webkit-details-marker {
        display: none;
    }

    .function-actions details summary::marker {
        display: none;
    }

    .function-actions details summary:hover {
        background: rgba(0, 120, 204, 0.2);
    }

    .function-actions details[open] summary {
        background: rgba(0, 120, 204, 0.2);
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
    }

    .function-parts .package-id {
        margin: 0;
        padding: 0;
        display: inline;
    }

    .function-parts .separator {
        color: #666;
        margin: 0;
        padding: 0;
        display: inline;
    }

    .function-parts .module {
        color: #00b894;
        font-weight: 600;
        margin: 0;
        padding: 0;
        display: inline;
    }

    .function-parts .function-name {
        color: #d73a49;
        font-weight: 600;
        margin: 0;
        padding: 0;
        display: inline;
    }

    .checkpoint-inspector {
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 8px;
    }

    .checkpoint-inspector h4 {
        margin: 0;
        color: #007acc;
        font-size: 18px;
    }

    .checkpoint-input-section {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
    }

    .checkpoint-input-section label {
        font-weight: bold;
        min-width: 140px;
    }

    .checkpoint-input-section input {
        flex: 1;
        max-width: 300px;
    }

    .checkpoint-loading,
    .checkpoint-placeholder,
    .no-transactions {
        padding: 20px;
        text-align: center;
        font-style: italic;
    }

    .transaction-list {
        overflow-y: auto;
        border: 1px solid #333;
        border-radius: 4px;
        max-height: 600px;
    }

    .transaction-details {
        border-bottom: 1px solid #444;
        margin: 0;
    }

    .transaction-details:last-child {
        border-bottom: none;
    }

    .transaction-summary {
        padding: 12px 16px;
        cursor: pointer;
        background: rgba(0, 0, 0, 0.1);
        border: none;
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 14px;
        transition: background-color 0.2s ease;
        list-style: none;
    }

    .transaction-summary::-webkit-details-marker {
        display: none;
    }

    .transaction-summary::marker {
        display: none;
    }

    .transaction-summary:hover {
        background: rgba(0, 120, 204, 0.1);
    }

    .transaction-details[open] .transaction-summary {
        background: rgba(0, 120, 204, 0.15);
        border-bottom: 1px solid #007acc;
    }

    .transaction-number {
        font-weight: bold;
        color: #007acc;
        min-width: 100px;
    }

    .transaction-digest {
        font-family: 'Courier New', monospace;
        font-size: 12px;
        color: #888;
        background: rgba(255, 255, 255, 0.05);
        padding: 2px 6px;
        border-radius: 3px;
        flex: 1;
    }

    .transaction-status {
        font-size: 11px;
        padding: 3px 8px;
        border-radius: 12px;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .transaction-status.success {
        background: rgba(0, 184, 148, 0.2);
        color: #00b894;
        border: 1px solid rgba(0, 184, 148, 0.3);
    }

    .transaction-status.failure {
        background: rgba(214, 48, 49, 0.2);
        color: #d63031;
        border: 1px solid rgba(214, 48, 49, 0.3);
    }

    .transaction-content {
        padding: 16px;
        background: rgba(0, 0, 0, 0.05);
        border-top: 1px solid #333;
    }

    .package-list {
        padding: 15px;
        max-height: 600px;
        overflow-y: auto;
    }

    .package-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #606060;
        font-family: monospace;
        font-size: 13px;
        position: relative;
        padding: 4px 0;
        gap: 8px;
    }

    .package-item:last-child {
        border-bottom: none;
    }

    .package-left {
        display: flex;
        align-items: center;
        gap: 8px;
        flex: 1;
        min-width: 0;
    }

    .package-header {
        display: flex;
        align-items: center;
        flex: 1;
        min-width: 0;
    }

    .package-info {
        min-width: 0;
    }

    .package-id-row,
    .sender-row,
    .modules-row {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 2px;
    }

    .sender-row:last-child,
    .modules-row:last-child {
        margin-bottom: 0;
    }

    .package-label,
    .sender-label,
    .modules-label {
        font-size: 11px;
        color: #888;
        min-width: 60px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .modules-list {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        flex: 1;
    }

    .module-name {
        background: rgba(0, 184, 148, 0.1);
        color: #00b894;
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 10px;
        font-weight: bold;
        border: 1px solid rgba(0, 184, 148, 0.2);
    }

    @media (max-width: 768px) {
        .input-row-single {
            flex-direction: column;
            align-items: stretch;
            gap: 15px;
        }

        .mode-selection-column {
            align-self: center;
        }

        .input-controls {
            flex-direction: column;
            align-items: stretch;
            gap: 8px;
        }

        .progress-label {
            flex-direction: column;
            align-items: flex-start;
            gap: 5px;
        }

        .progress-header {
            flex-direction: column;
            align-items: stretch;
            gap: 10px;
        }

        .progress-header p {
            text-align: center;
        }

        .address-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 5px;
        }

        .address-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
        }

        .address-stats {
            align-self: flex-start;
        }

        .function-item {
            padding: 20px 0;
        }

        .function-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
        }

        .function-stats {
            align-self: flex-start;
        }

        .function-signature {
            flex-wrap: wrap;
        }

        .transaction-ids-list {
            grid-template-columns: 1fr;
        }

        .tx-count,
        .call-count {
            align-self: flex-start;
        }

        .package-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
            padding: 4px 0;
        }

        .package-meta {
            align-self: flex-start;
        }

        .package-id-row,
        .sender-row,
        .modules-row {
            flex-wrap: wrap;
        }

        .transaction-summary {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
            padding: 16px;
        }

        .transaction-number {
            min-width: auto;
        }

        .transaction-digest {
            word-break: break-all;
            width: 100%;
        }

        .transaction-content {
            padding: 12px;
        }
    }
</style>

<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import { router } from 'svelte-spa-router';

    import TransactionView from '../../components/TransactionView.svelte';
    import { getClient, getSelectedNetworkConfig } from '../../utils/client';
    import { getAddressLink, getObjectLink } from '../../utils/explorer-links';
    import { fetchRecentTransactions, type TransactionNode } from '../txs/fetchTransactions';

    let transactions = $state<TransactionNode[]>([]);
    let isPolling = $state(true);
    let timeDirection = $state<'future' | 'past'>('future');
    let limit = $state(2000);
    let pollingInterval = $state(1000);
    let loading = $state(false);
    let error = $state('');

    let selectedTransaction = $state<any>(null);
    let showTransactionPopup = $state(false);

    let pollTimer: ReturnType<typeof setTimeout> | null = null;
    let destroyed = false;

    // Tabs.svelte keeps inactive tabs mounted (display: none), so onDestroy
    // never fires on tab switch — gate polling on the active route instead.
    const VIZ_ROUTE = '/txs-visualizer';
    let isOnRoute = $derived(router.location === VIZ_ROUTE);

    $effect(() => {
        if (!isOnRoute) {
            if (pollTimer) {
                clearTimeout(pollTimer);
                pollTimer = null;
            }
        } else if (isPolling && transactions.length > 0 && !pollTimer) {
            poll();
        }
    });

    let sortedTransactions = $derived(
        [...transactions].sort(
            (a, b) => parseInt(a.timestamp || '0') - parseInt(b.timestamp || '0'),
        ),
    );

    // Group transactions by sender (computed before addresses so the sort can reuse it)
    let txsBySender = $derived.by(() => {
        const map = new Map<string, TransactionNode[]>();
        for (const tx of sortedTransactions) {
            if (!map.has(tx.sender)) {
                map.set(tx.sender, []);
            }
            map.get(tx.sender)!.push(tx);
        }
        return map;
    });

    // Derived state for the visualizer — sort uses the already-built map (O(k log k) not O(n·k²))
    let addresses = $derived(
        [...txsBySender.keys()].sort(
            (a, b) => (txsBySender.get(b)?.length ?? 0) - (txsBySender.get(a)?.length ?? 0),
        ),
    );

    // Separate addresses into multiple txs and single tx
    let multiTxAddresses = $derived(
        addresses.filter((addr) => (txsBySender.get(addr)?.length || 0) > 1),
    );
    let singleTxAddresses = $derived(
        addresses.filter((addr) => (txsBySender.get(addr)?.length || 0) === 1),
    );

    // Combine single txs into one row
    let singleTxs = $derived(singleTxAddresses.flatMap((addr) => txsBySender.get(addr) || []));

    let multiTxCommonCalls = $derived.by(() => {
        const result = new Map<
            string,
            { label: string; count: number; pkg: string; fullCallName: string } | null
        >();

        for (const addr of multiTxAddresses) {
            const txs = txsBySender.get(addr) || [];
            const counts = new Map<
                string,
                { count: number; pkg: string; label: string; fullCallName: string }
            >();

            for (const tx of txs) {
                const txData = tx.rawData?.transaction?.data?.transaction;
                if (txData) {
                    const commands = txData.transactions || txData.commands;
                    if (commands && Array.isArray(commands)) {
                        for (const cmd of commands) {
                            const moveCall = cmd.MoveCall || cmd.moveCall;
                            if (moveCall) {
                                const pkg = moveCall.package;
                                const module = moveCall.module;
                                const func = moveCall.function;
                                const fullCallName = `${pkg}::${module}::${func}`;
                                const displayLabel = `${module}::${func}`;

                                const current = counts.get(fullCallName) || {
                                    count: 0,
                                    pkg,
                                    label: displayLabel,
                                    fullCallName,
                                };
                                current.count++;
                                counts.set(fullCallName, current);
                                break; // Only first move call per tx
                            }
                        }
                    }
                }
            }

            if (counts.size > 0) {
                const sorted = Array.from(counts.values()).sort((a, b) => b.count - a.count);
                result.set(addr, sorted[0]);
            } else {
                result.set(addr, null);
            }
        }

        return result;
    });

    // Group single txs by their first move call
    let otherTxsByMoveCall = $derived.by(() => {
        const map = new Map<string, { txs: TransactionNode[]; pkg: string; label: string }>();
        const noMoveCall: TransactionNode[] = [];

        for (const tx of singleTxs) {
            let hasMoveCall = false;

            // Try to find the first move call in the transaction data
            const txData = tx.rawData?.transaction?.data?.transaction;

            if (txData) {
                // The commands are often in the 'transactions' array for ProgrammableTransaction
                const commands = txData.transactions || txData.commands;

                if (commands && Array.isArray(commands)) {
                    for (const cmd of commands) {
                        const moveCall = cmd.MoveCall || cmd.moveCall;
                        if (moveCall) {
                            const pkg = moveCall.package;
                            const module = moveCall.module;
                            const func = moveCall.function;

                            const fullCallName = `${pkg}::${module}::${func}`;
                            const displayLabel = `${module}::${func}`;

                            if (!map.has(fullCallName)) {
                                map.set(fullCallName, { txs: [], pkg, label: displayLabel });
                            }
                            map.get(fullCallName)!.txs.push(tx);
                            hasMoveCall = true;
                            break; // Only group by the first move call
                        }
                    }
                }
            }

            if (!hasMoveCall) {
                noMoveCall.push(tx);
            }
        }

        return {
            withMoveCall: Array.from(map.entries()).sort(
                (a, b) => b[1].txs.length - a[1].txs.length,
            ),
            noMoveCall,
        };
    });

    // Count all move function calls across all transactions (all commands)
    let moveFunctionCounts = $derived.by(() => {
        const counts = new Map<
            string,
            {
                pkg: string;
                module: string;
                func: string;
                label: string;
                fullCallName: string;
                count: number;
            }
        >();

        for (const tx of sortedTransactions) {
            const txData = tx.rawData?.transaction?.data?.transaction;
            if (txData) {
                const commands = txData.transactions || txData.commands;
                if (commands && Array.isArray(commands)) {
                    for (const cmd of commands) {
                        const moveCall = cmd.MoveCall || cmd.moveCall;
                        if (moveCall) {
                            const pkg = moveCall.package;
                            const module = moveCall.module;
                            const func = moveCall.function;
                            const fullCallName = `${pkg}::${module}::${func}`;
                            const label = `${module}::${func}`;
                            const current = counts.get(fullCallName) || {
                                pkg,
                                module,
                                func,
                                label,
                                fullCallName,
                                count: 0,
                            };
                            current.count++;
                            counts.set(fullCallName, current);
                        }
                    }
                }
            }
        }

        return Array.from(counts.values()).sort((a, b) => b.count - a.count);
    });

    // Group move function counts by package, sorted by total calls per package descending
    // Ranks are embedded here so the template doesn't need O(n) indexOf() per row
    let moveFunctionGroups = $derived.by(() => {
        const pkgMap = new Map<
            string,
            { pkg: string; totalCount: number; fns: typeof moveFunctionCounts }
        >();

        for (const entry of moveFunctionCounts) {
            if (!pkgMap.has(entry.pkg)) {
                pkgMap.set(entry.pkg, { pkg: entry.pkg, totalCount: 0, fns: [] });
            }
            const group = pkgMap.get(entry.pkg)!;
            group.totalCount += entry.count;
            group.fns.push(entry);
        }

        const sorted = Array.from(pkgMap.values()).sort((a, b) => b.totalCount - a.totalCount);

        // Attach a global rank to each fn entry so the template doesn't do indexOf()
        let rank = 1;
        for (const group of sorted) {
            for (const fn of group.fns) {
                (fn as any).rank = rank++;
            }
        }
        return sorted;
    });

    // Precompute first move call per tx digest so the template doesn't re-parse rawData per dot
    let firstMoveCallByDigest = $derived.by(() => {
        const map = new Map<string, string>();
        for (const tx of sortedTransactions) {
            const txData = tx.rawData?.transaction?.data?.transaction;
            if (txData) {
                const commands = txData.transactions || txData.commands;
                if (commands && Array.isArray(commands)) {
                    for (const cmd of commands) {
                        const moveCall = cmd.MoveCall || cmd.moveCall;
                        if (moveCall) {
                            map.set(
                                tx.digest,
                                `${moveCall.package}::${moveCall.module}::${moveCall.function}`,
                            );
                            break;
                        }
                    }
                }
            }
        }
        return map;
    });

    // Cache network config — avoids repeated object construction per link render
    let networkConfig = $derived(getSelectedNetworkConfig());

    // Time bounds for the x-axis — use reduce to avoid spread-of-2000 items into Math.min/max
    let minTime = $derived.by(() => {
        if (sortedTransactions.length === 0) return 0;
        let min = parseInt(sortedTransactions[0].timestamp || '0');
        for (let i = 1; i < sortedTransactions.length; i++) {
            const t = parseInt(sortedTransactions[i].timestamp || '0');
            if (t < min) min = t;
        }
        return min;
    });
    let maxTime = $derived.by(() => {
        if (sortedTransactions.length === 0) return 0;
        let max = parseInt(sortedTransactions[0].timestamp || '0');
        for (let i = 1; i < sortedTransactions.length; i++) {
            const t = parseInt(sortedTransactions[i].timestamp || '0');
            if (t > max) max = t;
        }
        return max;
    });
    let timeRange = $derived(maxTime - minTime || 1);

    // Precompute per-dot { left, color } so the template does zero arithmetic per dot per render
    let dotDataByDigest = $derived.by(() => {
        const map = new Map<string, { left: number; color: string }>();
        const inv = 100 / timeRange;

        for (const address of multiTxAddresses) {
            const commonCall = multiTxCommonCalls.get(address)?.fullCallName;
            for (const tx of txsBySender.get(address) || []) {
                const left = (parseInt(tx.timestamp || '0') - minTime) * inv;
                const color =
                    firstMoveCallByDigest.get(tx.digest) === commonCall
                        ? COLOR_HIGHLIGHT
                        : COLOR_BASE;
                map.set(tx.digest, { left, color });
            }
        }
        for (const [, data] of otherTxsByMoveCall.withMoveCall) {
            for (const tx of data.txs) {
                const left = (parseInt(tx.timestamp || '0') - minTime) * inv;
                map.set(tx.digest, { left, color: COLOR_HIGHLIGHT });
            }
        }
        for (const tx of otherTxsByMoveCall.noMoveCall) {
            const left = (parseInt(tx.timestamp || '0') - minTime) * inv;
            map.set(tx.digest, { left, color: COLOR_BASE });
        }
        return map;
    });

    // Calculate PTBs per second
    let ptbsPerSecond = $derived.by(() => {
        if (sortedTransactions.length < 2 || timeRange === 0) return 0;
        // timeRange is in milliseconds, convert to seconds
        const seconds = timeRange / 1000;
        return (sortedTransactions.length / seconds).toFixed(2);
    });

    async function fetchInitial() {
        loading = true;
        error = '';
        try {
            const result = await fetchRecentTransactions({ limit: 50, orderBy: 'newest' });
            transactions = result.txs;
        } catch (e: any) {
            error = e.message || 'Failed to fetch transactions';
        } finally {
            loading = false;
        }
    }

    async function poll() {
        if (destroyed || !isOnRoute || !isPolling || transactions.length === 0) return;

        try {
            let result;
            if (timeDirection === 'future') {
                const newestCheckpoint = Math.max(...transactions.map((tx) => tx.checkpoint));
                result = await fetchRecentTransactions({
                    limit: 50,
                    orderBy: 'newest',
                    afterCheckpoint: newestCheckpoint.toString(),
                });
                if (result.txs.length > 0) {
                    const seen = new Set(transactions.map((tx) => tx.digest));
                    const fresh = result.txs.filter((tx) => !seen.has(tx.digest));
                    if (fresh.length > 0) {
                        transactions = [...transactions, ...fresh].slice(-limit);
                    }
                }
            } else {
                const oldestCheckpoint = Math.min(...transactions.map((tx) => tx.checkpoint));
                result = await fetchRecentTransactions({
                    limit: 50,
                    orderBy: 'newest',
                    beforeCheckpoint: oldestCheckpoint.toString(),
                });
                if (result.txs.length > 0) {
                    const seen = new Set(transactions.map((tx) => tx.digest));
                    const fresh = result.txs.filter((tx) => !seen.has(tx.digest));
                    if (fresh.length > 0) {
                        transactions = [...fresh, ...transactions].slice(0, limit);
                    }
                }
            }
        } catch (e: any) {
            console.error('Polling error:', e);
        }

        if (!destroyed && isOnRoute && isPolling) {
            pollTimer = setTimeout(poll, pollingInterval);
        }
    }

    function togglePolling() {
        isPolling = !isPolling;
        if (isPolling) {
            poll();
        } else if (pollTimer) {
            clearTimeout(pollTimer);
            pollTimer = null;
        }
    }

    function setDirection(dir: 'future' | 'past') {
        timeDirection = dir;
    }

    async function openTransaction(tx: TransactionNode) {
        selectedTransaction = tx.rawData;
        showTransactionPopup = true;
        try {
            const client = getClient();
            const fullTx = await client.getTransactionBlock({
                digest: tx.digest,
                options: {
                    showInput: true,
                    showRawInput: true,
                    showEffects: true,
                    showEvents: true,
                    showObjectChanges: true,
                    showBalanceChanges: true,
                },
            });
            if (showTransactionPopup && selectedTransaction?.digest === tx.digest) {
                selectedTransaction = fullTx;
            }
        } catch (e) {
            console.error('Failed to load full transaction:', e);
        }
    }

    function closeTransactionPopup() {
        showTransactionPopup = false;
        selectedTransaction = null;
    }

    onMount(() => {
        fetchInitial().then(() => {
            if (isPolling) {
                pollTimer = setTimeout(poll, pollingInterval);
            }
        });
    });

    onDestroy(() => {
        destroyed = true;
        if (pollTimer) {
            clearTimeout(pollTimer);
            pollTimer = null;
        }
    });

    function formatTime(timestamp: string) {
        return new Date(parseInt(timestamp)).toLocaleTimeString();
    }

    async function reset() {
        loading = true;
        timeDirection = 'future';
        try {
            const result = await fetchRecentTransactions({ limit: 50, orderBy: 'newest' });
            transactions = result.txs;
        } catch (e: any) {
            error = e.message || 'Failed to reset';
        } finally {
            loading = false;
        }
    }

    const COLOR_BASE = '#3b82f6'; // Mid blue
    const COLOR_HIGHLIGHT = '#bfdbfe'; // Brighter blue highlight
</script>

<div class="page-container">
    <div class="header">
        <h1>Transactions Visualizer</h1>
        <p class="subtitle">Real-time visualization of programmable transaction blocks</p>
    </div>

    <div class="controls card">
        <div class="control-group">
            <button class="btn {isPolling ? 'btn-danger' : 'btn-primary'}" onclick={togglePolling}>
                {isPolling ? 'Pause' : 'Resume'}
            </button>

            <div class="direction-toggle">
                <button
                    class="btn {timeDirection === 'future' ? 'btn-active' : 'btn-outline'}"
                    onclick={() => setDirection('future')}
                >
                    Future (Newer)
                </button>
                <button
                    class="btn {timeDirection === 'past' ? 'btn-active' : 'btn-outline'}"
                    onclick={() => setDirection('past')}
                >
                    Past (Older)
                </button>
            </div>
            <button class="btn btn-outline" onclick={reset} title="Clear and jump to latest">
                Reset
            </button>
        </div>

        <div class="stats-group">
            <div class="stat-row">
                <span class="stat-label">PTBs/sec:</span>
                <span class="stat-value">{ptbsPerSecond}</span>
            </div>
            <div class="legend">
                <span class="legend-item">
                    <span class="dot highlight"></span> Txs with most common contract call
                </span>
                <span class="legend-item">
                    <span class="dot base"></span> Other transactions
                </span>
            </div>
        </div>

        <div class="control-group">
            <label>
                Max Txs:
                <input type="number" bind:value={limit} step="100" class="input-small" />
                <span class="tx-current-count">({sortedTransactions.length})</span>
            </label>
            <label>
                Interval (ms):
                <input
                    type="number"
                    bind:value={pollingInterval}
                    min="500"
                    step="500"
                    class="input-small"
                />
            </label>
        </div>
    </div>

    {#if loading && transactions.length === 0}
        <div class="loading">Loading initial transactions...</div>
    {:else if error}
        <div class="error">{error}</div>
    {:else if transactions.length === 0}
        <div class="empty">No transactions found.</div>
    {:else}
        <div class="visualizer-container card">
            <p class="visualizer-desc">
                Addresses with ≥2 transactions are shown as individual rows — the move call invoked
                most often as the first command is listed below the address. <br /> Single-tx
                senders are grouped by their first move call (independent of address), or collected
                under
                <em>Other Txs</em> if no move call is involved.
            </p>
            <div class="timeline-header">
                <div class="address-col">Sender/first fn call</div>
                <div class="timeline-col">
                    <span class="time-label start">{formatTime(minTime.toString())}</span>
                    <span class="time-label mid-1"
                        >{formatTime((minTime + timeRange * 0.33).toString())}</span
                    >
                    <span class="time-label mid-2"
                        >{formatTime((minTime + timeRange * 0.66).toString())}</span
                    >
                    <span class="time-label end">{formatTime(maxTime.toString())}</span>
                </div>
            </div>

            <div class="timeline-body">
                {#each multiTxAddresses as address (address)}
                    <div class="timeline-row">
                        <div class="address-col">
                            <div class="address-row-main">
                                <a
                                    href={getAddressLink(networkConfig, address)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="address-link"
                                    title={address}
                                >
                                    {address.slice(0, 6)}...{address.slice(-4)}
                                </a>
                                <span class="tx-count"
                                    >({txsBySender.get(address)?.length || 0})</span
                                >
                            </div>
                            {#if multiTxCommonCalls.get(address)}
                                <div class="common-call">
                                    <span class="call-icon">⤷</span>
                                    <a
                                        href={getObjectLink(
                                            networkConfig,
                                            multiTxCommonCalls.get(address)!.pkg,
                                        )}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="common-call-link"
                                        style="color: {COLOR_HIGHLIGHT}"
                                    >
                                        {multiTxCommonCalls.get(address)!.label}
                                    </a>
                                    <span class="call-count"
                                        >({multiTxCommonCalls.get(address)!.count})</span
                                    >
                                </div>
                            {/if}
                        </div>
                        <div class="timeline-col">
                            <div class="timeline-line"></div>
                            {#each txsBySender.get(address) || [] as tx (tx.digest)}
                                {@const d = dotDataByDigest.get(tx.digest)}
                                <button
                                    class="tx-dot"
                                    style="left: {d?.left ?? 0}%; background-color: {d?.color ??
                                        COLOR_BASE}"
                                    title="Tx: {tx.digest}&#10;Time: {formatTime(
                                        tx.timestamp || '0',
                                    )}"
                                    onclick={() => openTransaction(tx)}
                                    aria-label="View transaction {tx.digest}"
                                ></button>
                            {/each}
                        </div>
                    </div>
                {/each}

                {#each otherTxsByMoveCall.withMoveCall as [fullCall, data] (fullCall)}
                    <div class="timeline-row other-txs-row">
                        <div class="address-col">
                            <div class="address-row-main">
                                <a
                                    href={getObjectLink(networkConfig, data.pkg)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="address-link other-txs-label"
                                    style="color: {COLOR_HIGHLIGHT}"
                                    title={fullCall}
                                >
                                    {data.label}
                                </a>
                                <span class="tx-count">({data.txs.length})</span>
                            </div>
                        </div>
                        <div class="timeline-col">
                            <div class="timeline-line"></div>
                            {#each data.txs as tx (tx.digest)}
                                {@const d = dotDataByDigest.get(tx.digest)}
                                <button
                                    class="tx-dot"
                                    style="left: {d?.left ?? 0}%; background-color: {d?.color ??
                                        COLOR_HIGHLIGHT}"
                                    title="Sender: {tx.sender}&#10;Tx: {tx.digest}&#10;Time: {formatTime(
                                        tx.timestamp || '0',
                                    )}"
                                    onclick={() => openTransaction(tx)}
                                    aria-label="View transaction {tx.digest}"
                                ></button>
                            {/each}
                        </div>
                    </div>
                {/each}

                {#if otherTxsByMoveCall.noMoveCall.length > 0}
                    <div class="timeline-row other-txs-row">
                        <div class="address-col">
                            <div class="address-row-main">
                                <span class="address-link other-txs-label">Other Txs</span>
                                <span class="tx-count"
                                    >({otherTxsByMoveCall.noMoveCall.length})</span
                                >
                            </div>
                        </div>
                        <div class="timeline-col">
                            <div class="timeline-line"></div>
                            {#each otherTxsByMoveCall.noMoveCall as tx (tx.digest)}
                                {@const d = dotDataByDigest.get(tx.digest)}
                                <button
                                    class="tx-dot"
                                    style="left: {d?.left ?? 0}%; background-color: {d?.color ??
                                        COLOR_BASE}"
                                    title="Sender: {tx.sender}&#10;Tx: {tx.digest}&#10;Time: {formatTime(
                                        tx.timestamp || '0',
                                    )}"
                                    onclick={() => openTransaction(tx)}
                                    aria-label="View transaction {tx.digest}"
                                ></button>
                            {/each}
                        </div>
                    </div>
                {/if}
            </div>
        </div>
    {/if}

    <!-- Move Function Calls Table -->
    {#if moveFunctionGroups.length > 0}
        <div class="move-calls-table card">
            <h2 class="table-title">Move Function Calls</h2>
            <div class="fn-table-scroll">
                <table class="fn-table">
                    <thead>
                        <tr>
                            <th class="col-count">Count</th>
                            <th class="col-fn">Function</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each moveFunctionGroups as group, gi}
                            {#each group.fns as entry, fi}
                                <tr class="fn-row {gi % 2 === 0 ? 'group-even' : 'group-odd'}">
                                    <td class="col-count">{entry.count}</td>
                                    <td class="col-fn">
                                        <div class="fn-cell">
                                            <div class="fn-pkg-part">
                                                {#if fi === 0}
                                                    <a
                                                        href={getObjectLink(
                                                            networkConfig,
                                                            entry.pkg,
                                                        )}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        class="fn-link pkg-link"
                                                        title={entry.pkg}
                                                        >{entry.pkg.slice(0, 8)}...{entry.pkg.slice(
                                                            -4,
                                                        )}::</a
                                                    >
                                                {/if}
                                            </div>
                                            <a
                                                href="{getObjectLink(
                                                    networkConfig,
                                                    entry.pkg,
                                                )}&module={entry.module}"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                class="fn-link fn-label"
                                                title="{entry.pkg}&module={entry.module}"
                                                >{entry.module}::{entry.func}</a
                                            >
                                        </div>
                                    </td>
                                </tr>
                            {/each}
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
    {/if}

    <!-- Transaction Popup Modal -->
    {#if showTransactionPopup && selectedTransaction}
        <div
            class="modal-overlay"
            onclick={closeTransactionPopup}
            role="button"
            tabindex="0"
            onkeydown={(e) => e.key === 'Escape' && closeTransactionPopup()}
        >
            <div
                class="modal-content"
                onclick={(e) => e.stopPropagation()}
                onkeydown={(e) => e.stopPropagation()}
                role="dialog"
                tabindex="-1"
            >
                <TransactionView
                    bind:value={selectedTransaction}
                    showTypeInfo={true}
                    shortPackageIds={true}
                />
            </div>
        </div>
    {/if}
</div>

<style>
    .page-container {
        padding: 1rem;
        max-width: 100%;
        margin: 0 auto;
        overflow-x: hidden;
    }

    .header {
        margin-bottom: 1.5rem;
    }

    .subtitle {
        color: var(--text-muted);
        margin-top: 0.5rem;
    }

    .card {
        background: var(--background-card);
        border-radius: 8px;
        padding: 1rem;
        margin-bottom: 1.5rem;
        border: 1px solid var(--border-color);
    }

    .controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 1rem;
    }

    .control-group {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .direction-toggle {
        display: flex;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 6px;
        padding: 0.25rem;
    }

    .stats-group {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.25rem;
        background: rgba(0, 0, 0, 0.2);
        padding: 0.5rem 1rem;
        border-radius: 6px;
        border: 1px solid var(--border-color);
        min-width: 250px;
    }

    .stat-row {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        width: 100%;
    }

    .legend {
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin-top: 4px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        padding-top: 4px;
        width: 100%;
    }

    .legend-item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.75rem;
        color: var(--text-muted);
    }

    .legend-item .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
    }

    .legend-item .dot.base {
        background: #3b82f6;
    }

    .legend-item .dot.highlight {
        background: #bfdbfe;
    }

    .stat-label {
        color: var(--text-muted);
        font-size: 0.9rem;
    }

    .stat-value {
        font-weight: 600;
        color: #60a5fa;
        font-family: monospace;
        font-size: 1.1rem;
    }

    .btn {
        padding: 0.5rem 1rem;
        border-radius: 6px;
        border: none;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.2s;
    }

    .btn-primary {
        background: var(--primary-color);
        color: white;
    }

    .btn-primary:hover {
        background: var(--primary-hover);
    }

    .btn-danger {
        background: #ef4444;
        color: white;
    }

    .btn-danger:hover {
        background: #dc2626;
    }

    .btn-outline {
        background: transparent;
        color: var(--text-color);
    }

    .btn-outline:hover {
        background: rgba(255, 255, 255, 0.05);
    }

    .btn-active {
        background: var(--primary-color);
        color: white;
    }

    .input-small {
        width: 80px;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        border: 1px solid var(--border-color);
        background: rgba(0, 0, 0, 0.2);
        color: var(--text-color);
        margin-left: 0.5rem;
    }

    .tx-current-count {
        font-size: 0.85rem;
        color: #60a5fa;
        font-family: monospace;
        margin-left: 0.4rem;
    }

    .visualizer-container {
        overflow-x: auto;
    }

    .visualizer-desc {
        font-size: 0.8rem;
        color: var(--text-muted);
        margin: 0 0 0.75rem;
        line-height: 1.5;
    }

    .timeline-header {
        display: flex;
        border-bottom: 1px solid var(--border-color);
        padding-bottom: 0.5rem;
        margin-bottom: 0.5rem;
        font-weight: 600;
        color: var(--text-muted);
    }

    .address-col {
        width: 280px;
        flex-shrink: 0;
        padding-right: 1.5rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 0;
        line-height: normal;
        overflow: hidden;
    }

    .address-row-main {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        margin-bottom: 2px;
        min-width: 0;
    }

    .address-row-main .address-link,
    .address-row-main .other-txs-label {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        flex: 1;
    }

    .common-call {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 0.75rem;
        color: var(--text-muted);
        padding-left: 12px;
        white-space: nowrap;
        opacity: 0.8;
    }

    .call-icon {
        color: var(--primary-color);
        opacity: 0.7;
    }

    .common-call-link {
        color: var(--primary-color);
        opacity: 0.9;
        text-decoration: none;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 180px;
        transition: filter 0.2s;
    }

    .common-call-link:hover {
        text-decoration: underline;
        filter: brightness(1.2);
    }

    .other-txs-label {
        font-family: monospace;
        font-weight: 600;
        text-decoration: none;
        transition: filter 0.2s;
    }

    .other-txs-label:hover {
        text-decoration: underline;
        filter: brightness(1.2);
    }

    .call-count {
        font-size: 0.75rem;
        opacity: 0.8;
        font-weight: 500;
    }

    .timeline-col {
        flex-grow: 1;
        position: relative;
        min-width: 600px;
    }

    .time-label {
        position: absolute;
        font-size: 0.8rem;
    }

    .time-label.start {
        left: 0;
    }

    .time-label.mid-1 {
        left: 33%;
        transform: translateX(-50%);
    }

    .time-label.mid-2 {
        left: 66%;
        transform: translateX(-50%);
    }

    .time-label.end {
        right: 0;
    }

    .timeline-row {
        display: flex;
        align-items: center;
        margin-bottom: 0.8rem;
        min-height: 32px;
        /* Scope layout changes to this row, prevents scroll-triggered full-page reflow */
        contain: layout style;
    }

    .address-link {
        color: #3b82f6; /* Matching COLOR_BASE */
        text-decoration: none;
        font-family: monospace;
        font-size: 0.9rem;
    }

    .address-link:hover {
        text-decoration: underline;
        color: #60a5fa;
    }

    /* .other-txs-label styling moved up to common-call-link area */

    .other-txs-row {
        opacity: 1; /* Was 0.8, making it brighter */
    }

    .tx-count {
        flex-shrink: 0;
        margin-left: 4px;
        font-size: 0.8rem;
        color: #cbd5e1; /* Brighter neutral color */
        background: rgba(255, 255, 255, 0.15);
        padding: 0.1rem 0.4rem;
        border-radius: 10px;
    }

    .timeline-line {
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        height: 1px;
        background: rgba(255, 255, 255, 0.2);
        transform: translateY(-50%);
    }

    .tx-dot {
        position: absolute;
        top: 50%;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        border: 1px solid rgba(0, 0, 0, 0.5);
        cursor: pointer;
        /* No transitions at rest — avoids 1000 simultaneous animations on every poll update */
        will-change: transform;
        z-index: 10;
        padding: 0;
    }

    .tx-dot:hover {
        transform: translate(-50%, -50%) scale(1.5);
        filter: brightness(1.2);
        z-index: 20;
        /* Transitions only activate on hover entry/exit, not on position updates */
        transition:
            transform 0.15s,
            filter 0.15s;
    }

    .table-title {
        font-size: 1rem;
        font-weight: 600;
        margin-bottom: 0.75rem;
        color: var(--text-color);
    }

    .fn-table-scroll {
        overflow-x: auto;
    }

    .fn-table {
        width: auto;
        border-collapse: collapse;
        font-size: 0.9rem;
    }

    .fn-table thead tr {
        border-bottom: 1px solid var(--border-color);
    }

    .fn-table th {
        text-align: left;
        padding: 0.4rem 0.75rem;
        color: var(--text-muted);
        font-weight: 600;
        white-space: nowrap;
    }

    .fn-table td {
        padding: 0.35rem 0.75rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .fn-table tbody tr:hover {
        background: rgba(255, 255, 255, 0.04);
    }

    .col-fn {
        font-family: monospace;
        text-align: left;
        width: 100%;
        min-width: 0; /* allow table cell to shrink below content width */
    }

    .fn-cell {
        display: flex;
        align-items: baseline;
        gap: 0;
        min-width: 0;
    }

    /* Fixed-width slot for the pkg part so all rows align on desktop */
    /* "0xae65a3...8b7d::" = 17 chars in monospace */
    .fn-pkg-part {
        display: inline-block;
        width: 17.5ch;
        flex-shrink: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: clip;
    }

    .fn-label {
        color: #bfdbfe;
        white-space: nowrap;
    }

    .col-count {
        width: 5rem;
        text-align: right;
        font-family: monospace;
        color: #60a5fa;
        font-weight: 600;
    }

    .fn-row.group-even {
        background: rgba(255, 255, 255, 0.02);
    }

    .fn-row.group-odd {
        background: rgba(59, 130, 246, 0.05);
    }

    .fn-row.group-even:first-of-type td,
    .fn-row.group-odd:first-of-type td {
        padding-top: 0.55rem;
    }

    .pkg-link {
        color: #94a3b8;
        opacity: 0.85;
    }

    /* remove old indent span rule */

    .fn-link {
        color: #bfdbfe;
        text-decoration: none;
        transition: filter 0.2s;
    }

    .fn-link:hover {
        text-decoration: underline;
        filter: brightness(1.2);
    }

    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        backdrop-filter: blur(4px);
    }

    .modal-content {
        background: var(--background-card);
        border-radius: 12px;
        width: 90%;
        max-width: 1200px;
        max-height: 90vh;
        overflow-y: auto;
        padding: 2rem;
        border: 1px solid var(--border-color);
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
    }
</style>

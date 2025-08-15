<script lang="ts">
    import { List } from 'svelte-virtual';

    import type { StakeObject } from '../lib/staking-rewards/';

    export let currentEpoch: number = 91;
    export let stakeObjects: StakeObject[] = [];

    function copyToClipboard(text: string) {
        navigator.clipboard.writeText(text);
    }

    let minEpoch = 0;
    $: minEpoch = (() => {
        if (stakeObjects.length === 0) return 0;
        let min = Infinity;
        stakeObjects.forEach((stakeObject) => {
            if (stakeObject.firstEpoch < min) min = stakeObject.firstEpoch;
        });
        return min === Infinity ? 0 : min;
    })();

    let epochs: number[] = [];
    $: epochs = Array.from({ length: currentEpoch + 1 }, (_, i) => i).slice(minEpoch);

    // Check if a stake object was active in a given epoch
    function isActiveInEpoch(stakeObject: StakeObject, epoch: number): boolean {
        return epoch >= stakeObject.firstEpoch && epoch <= stakeObject.lastEpoch;
    }

    // Check if a stake object is pending in a given epoch
    function isPreActivationInEpoch(stakeObject: StakeObject, epoch: number): boolean {
        return epoch >= stakeObject.firstEpoch && epoch < stakeObject.stakeActivationEpoch;
    }

    // Calculate total rewards for all objects in a given epoch
    function getTotalRewardsForEpoch(epoch: number): string {
        let total = 0n;
        stakeObjects.forEach((stakeObject) => {
            const rewards = stakeObject.rewardsByEpoch[epoch];
            if (rewards && rewards !== '0') {
                try {
                    total += BigInt(rewards);
                } catch (e) {
                    // Ignore invalid values
                }
            }
        });
        return total === 0n ? '0' : (Number(total) / 1_000_000_000).toFixed(2) + ' IOTA';
    }

    // Calculate total accumulated rewards for all objects in a given epoch
    function getTotalAccumulatedRewardsForEpoch(epoch: number): string {
        let total = 0n;
        stakeObjects.forEach((stakeObject) => {
            const rewards = stakeObject.accumulatedRewards[epoch];
            if (rewards && rewards !== '0') {
                try {
                    total += BigInt(rewards);
                } catch (e) {
                    // Ignore invalid values
                }
            }
        });
        return total === 0n ? '0' : (Number(total) / 1_000_000_000).toFixed(2) + ' IOTA';
    }
    // Format principal value for display
    function formatPrincipal(principal: string): string {
        if (!principal || principal === '0') return 'N/A';
        try {
            const value = BigInt(principal);
            return 'Initial amount: ' + (Number(value) / 1_000_000_000).toFixed(2) + ' IOTA';
        } catch {
            return 'N/A';
        }
    }

    function getFirstPrincipal(stakeObject: StakeObject): string {
        const epochs = Object.keys(stakeObject.principalByEpoch).map(Number);
        if (epochs.length === 0) return '';
        const minEpoch = Math.min(...epochs);
        return stakeObject.principalByEpoch[minEpoch];
    }

    // Elements for scroll synchronization
    let headerElement: HTMLElement;
    let listElement: any; // Reference to the List component

    // Synchronize horizontal scroll between header and virtual list
    function syncHeaderScroll(event: Event) {
        const target = event.target as HTMLElement;
        // Find the scrollable container within the virtual list
        let scrollContainer: HTMLElement | null = null;
        if (listElement) {
            scrollContainer =
                listElement.querySelector?.('[data-virtual-list-viewport]') ||
                listElement.querySelector?.('[style*="overflow"]');
        }
        if (scrollContainer && scrollContainer.scrollLeft !== target.scrollLeft) {
            scrollContainer.scrollLeft = target.scrollLeft;
        }
    }

    function syncListScroll(event: Event) {
        const target = event.target as HTMLElement;
        if (headerElement && headerElement.scrollLeft !== target.scrollLeft) {
            headerElement.scrollLeft = target.scrollLeft;
        }
    }

    // Set up scroll synchronization for the virtual list
    function setupScrollSync(node: HTMLElement) {
        // Find the scrollable container within the virtual list
        const findScrollContainer = () => {
            return (
                (node.querySelector('[style*="overflow"]') as HTMLElement) ||
                (node.querySelector('[data-virtual-list-viewport]') as HTMLElement)
            );
        };

        let scrollContainer: HTMLElement | null = null;

        // Use a timeout to ensure the virtual list is fully rendered
        const timeout = setTimeout(() => {
            scrollContainer = findScrollContainer();
            if (scrollContainer) {
                scrollContainer.addEventListener('scroll', syncListScroll);
            }
        }, 100);

        return {
            destroy() {
                clearTimeout(timeout);
                if (scrollContainer) {
                    scrollContainer.removeEventListener('scroll', syncListScroll);
                }
            },
        };
    }

    let selectedStakeObject: StakeObject | null = null;
</script>

{#if selectedStakeObject}
    <div class="address-hover-inline">
        <button
            class="close-hover"
            aria-label="Close address info"
            on:click={() => (selectedStakeObject = null)}>×</button
        >
        <div class="full-address">{selectedStakeObject.address}</div>
        <div class="principal">{formatPrincipal(getFirstPrincipal(selectedStakeObject))}</div>
        <div class="pool-id">
            Pool: {selectedStakeObject.poolId}
        </div>
        First Epoch: {selectedStakeObject.firstEpoch}
        Last Epoch: {selectedStakeObject.lastEpoch}
    </div>
{/if}

<div style="margin-bottom: 8px; text-align: left;">
    Data might be incomplete. Values are estimates due to rounding. Epochs before the first
    transaction are hidden.<br />
    Transfer history is currently not taken into account, values are computed like the objects were always
    owned by the provided address.
</div>
<div class="table-container">
    <div class="virtual-table">
        <!-- Fixed header that scrolls horizontally -->
        <div class="table-header" bind:this={headerElement} on:scroll={syncHeaderScroll}>
            <div class="header-row">
                <div class="header-cell epoch-header">Epoch</div>
                <div class="header-cell rewards-header">Rewards</div>
                <div class="header-cell rewards-header">Accumulated</div>
                {#each stakeObjects as stakeObject}
                    <div class="header-cell stake-header-cell">
                        <div class="stake-header">
                            <div class="address-container">
                                <span
                                    class="address"
                                    role="button"
                                    tabindex="0"
                                    on:click={() => {
                                        selectedStakeObject = stakeObject;
                                    }}
                                    on:keydown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            selectedStakeObject = stakeObject;
                                        }
                                    }}
                                >
                                    {stakeObject.address.slice(0, 6)}..{stakeObject.address.slice(
                                        -3,
                                    )}
                                    <button
                                        class="copy-btn"
                                        title="Copy full address"
                                        on:click={(e) => {
                                            e.stopPropagation();
                                            copyToClipboard(stakeObject.address);
                                        }}
                                    >
                                        📋
                                    </button>
                                </span>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        </div>

        <!-- Virtual scrolling body -->
        <div class="table-body" use:setupScrollSync>
            <List bind:this={listElement} itemCount={epochs.length} itemSize={50} height={800}>
                <div slot="item" let:index let:style {style} class="table-row">
                    <div class="data-row">
                        <div class="table-cell epoch-cell">{epochs[index]}</div>
                        <div class="table-cell rewards-cell">
                            {epochs[index] === currentEpoch
                                ? 'pending'
                                : getTotalRewardsForEpoch(epochs[index])}
                        </div>
                        <div class="table-cell rewards-cell">
                            {epochs[index] === currentEpoch
                                ? 'pending'
                                : getTotalAccumulatedRewardsForEpoch(epochs[index])}
                        </div>
                        {#each stakeObjects as stakeObject}
                            <div class="table-cell stake-cell">
                                <div class="stake-popup-container">
                                    {#if epochs[index] === currentEpoch}
                                        pending
                                    {:else if isPreActivationInEpoch(stakeObject, epochs[index])}
                                        <div class="pre-active-indicator">pre-active</div>
                                    {:else if isActiveInEpoch(stakeObject, epochs[index]) && epochs[index] >= stakeObject.firstEpoch}
                                        <div class="stake-cell-content">
                                            <span class="stake-value">
                                                {stakeObject.rewardsByEpoch[epochs[index]] === '0'
                                                    ? '-'
                                                    : (
                                                          Number(
                                                              stakeObject.rewardsByEpoch[
                                                                  epochs[index]
                                                              ],
                                                          ) / 1_000_000_000
                                                      ).toFixed(2) + ' IOTA'}
                                            </span>
                                            {#if stakeObject.principalByEpoch[epochs[index]] && stakeObject.principalByEpoch[epochs[index - 1]] && stakeObject.principalByEpoch[epochs[index]] !== stakeObject.principalByEpoch[epochs[index - 1]]}
                                                <span class="principal-change-tooltip">
                                                    <span class="principal-change-icon">❗</span>
                                                    <span class="principal-tooltip-text">
                                                        Principal amount changed from
                                                        {(
                                                            Number(
                                                                stakeObject.principalByEpoch[
                                                                    epochs[index - 1]
                                                                ],
                                                            ) / 1_000_000_000
                                                        ).toFixed(2)} IOTA to
                                                        {(
                                                            Number(
                                                                stakeObject.principalByEpoch[
                                                                    epochs[index]
                                                                ],
                                                            ) / 1_000_000_000
                                                        ).toFixed(2)} IOTA
                                                    </span>
                                                </span>
                                            {/if}
                                            <div class="stake-popup">
                                                <div>
                                                    Rewards this epoch: {(
                                                        Number(
                                                            stakeObject.rewardsByEpoch[
                                                                epochs[index]
                                                            ],
                                                        ) / 1_000_000_000
                                                    ).toFixed(9)} IOTA
                                                </div>
                                                <div>
                                                    Accumulated rewards: {(
                                                        Number(
                                                            stakeObject.accumulatedRewards[
                                                                epochs[index]
                                                            ],
                                                        ) / 1_000_000_000
                                                    ).toFixed(9)} IOTA
                                                </div>
                                            </div>
                                        </div>
                                    {:else}
                                        <div class="inactive-indicator">-</div>
                                    {/if}
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>
            </List>
        </div>
    </div>
</div>

<style>
    .table-container {
        overflow-x: auto;
        border-radius: 4px;
    }

    .virtual-table {
        display: flex;
        flex-direction: column;
        height: 900px;
    }

    .table-header {
        position: sticky;
        top: 0;
        z-index: 20;
        background-color: #131d2b;
        border-bottom: 1px solid #bacce6;
        overflow-x: auto;
        overflow-y: hidden;
        scrollbar-width: none;
        -ms-overflow-style: none;
    }
    .table-header::-webkit-scrollbar {
        display: none;
    }
    .table-body {
        flex: 1;
        overflow: auto;
    }
    .table-row {
        display: flex;
        align-items: center;
        min-height: 32px;
    }
    .header-row {
        display: flex;
        align-items: center;
        min-height: 60px;
        font-weight: 600;
        min-width: fit-content;
    }
    .data-row {
        display: flex;
        align-items: center;
        min-height: 32px;
        border-bottom: 1px solid #2a3441;
        min-width: fit-content;
    }
    .data-row:hover {
        background-color: #1a2332;
    }
    .table-cell,
    .header-cell {
        padding: 4px;
        text-align: center;
        border-right: 1px solid #2a3441;
    }
    .header-cell {
        padding: 8px 4px;
        font-weight: 600;
        border-right: 1px solid #bacce6;
    }
    .epoch-header,
    .epoch-cell {
        position: sticky;
        left: 0;
        z-index: 21;
        background-color: #131d2b;
        box-shadow: 2px 0 4px -2px #0002;
        width: 70px;
        flex-shrink: 0;
        font-size: 1em !important;
    }
    .rewards-header,
    .rewards-cell {
        width: 130px;
        flex-shrink: 0;
        font-size: 1em !important;
    }
    .stake-header-cell,
    .stake-cell {
        width: 140px;
        flex-shrink: 0;
    }

    .stake-header {
        display: flex;
        flex-direction: column;
        gap: 2px;
        font-size: 0.85em;
    }

    .address-container {
        position: relative;
        display: inline-block;
    }

    .address {
        font-family: monospace;
        font-weight: bold;
        color: #ffffff;
        word-break: break-all;
    }

    .close-hover {
        position: absolute;
        top: 8px;
        right: 12px;
        background: none;
        border: none;
        color: #ff3b3b;
        font-size: 1.5em;
        cursor: pointer;
        z-index: 10000;
        padding: 0;
        font-weight: bold;
    }

    .full-address {
        font-family: monospace;
        margin-bottom: 4px;
        word-break: break-all;
        color: #a5bbe1;
    }

    .principal {
        color: #a5bbe1;
        font-weight: 500;
        margin-bottom: 2px;
    }

    .pool-id {
        color: #bacce6;
        font-size: 0.9em;
        font-family: monospace;
    }

    .epoch-cell {
        font-weight: 500;
        background-color: #131d2b;
        font-size: 0.75em;
    }

    .rewards-cell {
        font-size: 0.75em;
    }

    .stake-cell {
        padding: 4px;
    }

    .inactive-indicator {
        color: #e2e8f0;
        font-size: 1em;
        font-size: 0.75em;
    }

    .pre-active-indicator {
        color: black;
        background-color: #ff9800;
        font-size: 0.75em;
    }

    .copy-btn {
        background: none;
        background-color: rgba(102, 108, 113, 0.479);
        border: none;
        cursor: pointer;
        font-size: 0.1em;
        color: #a1b5d8;
        line-height: 1;
        padding: 0.3rem;
        border-radius: 3px;
    }

    .address-hover-inline {
        position: relative;
        margin: 0 auto 16px auto;
        background: #232b3a;
        color: #fff;
        border: 1px solid #bacce6;
        border-radius: 6px;
        padding: 16px 16px 16px 16px;
        min-width: 260px;
        max-width: 600px;
        box-shadow: 0 2px 8px #0002;
        font-size: 0.95em;
        white-space: pre-line;
        font-family: monospace;
        display: flex;
        flex-direction: column;
    }

    /* Add CSS for popup */
    .stake-popup-container {
        position: relative;
        display: inline-block;
    }
    .stake-cell-content .stake-popup {
        display: none;
        position: absolute;
        left: 50%;
        bottom: 100%;
        transform: translateX(-50%) translateY(-8px);
        background: #232b3a;
        color: #fff;
        border: 1px solid #bacce6;
        border-radius: 6px;
        padding: 8px 12px;
        min-width: 180px;
        box-shadow: 0 2px 8px #0002;
        font-size: 0.95em;
        white-space: pre-line;
        z-index: 9999;
    }
    .stake-cell-content:hover .stake-popup {
        display: block;
    }
    .stake-value {
        cursor: pointer;
        font-weight: bold;
        color: #38a169;
    }

    .principal-change-tooltip {
        position: relative;
        display: inline-block;
        margin-left: 6px;
    }
    .principal-change-icon {
        color: #ff9800;
        font-size: 1.2em;
        cursor: pointer;
        vertical-align: middle;
    }
    .principal-tooltip-text {
        visibility: hidden;
        width: max-content;
        background-color: #232b3a;
        color: #fff;
        text-align: left;
        border-radius: 6px;
        padding: 8px 12px;
        position: absolute;
        z-index: 10000;
        left: 50%;
        bottom: 120%;
        transform: translateX(-50%);
        box-shadow: 0 2px 8px #0002;
        font-size: 0.95em;
        white-space: pre-line;
        border: 1px solid #ff9800;
    }
    .principal-change-tooltip:hover .principal-tooltip-text {
        visibility: visible;
    }
</style>

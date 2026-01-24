<script lang="ts">
    import { onMount } from 'svelte';

    import IotaAmountInput from '../../components/IotaAmountInput.svelte';
    import TransactionView from '../../components/TransactionView.svelte';
    import { sharedClientConfig } from '../../utils/local-storage-store';
    import { activeAddress } from '../../utils/signer-data';
    import {
        claim,
        config,
        getDynamicFields,
        getIotaNamesPackageId,
        getPackageIds,
        getRegistryEntry,
        getReverseRegisteredAddresses,
        listAuctions,
        listRegisteredNames,
        placeBid,
        registerName,
        resolveAddress,
        resolveName,
        setCustomPackageId,
        setReverseLookup,
        setTargetAddress,
        startAuctionAndPlaceBid,
    } from './iota-names-service';

    let address = $state('0x0000a4984bd495d4346fa208ddff4f5d5e5ad48c21dec631ddebc99809f16900');
    let nameName = $state('name.iota');
    let bidPrice = $state(10000000);
    let showIotaNamesIds = $state(false);
    // Will be updated with the result
    let value = $state<any>({});
    // Track if fetching is in progress
    let isFetchingNames = $state(false);
    let isFetchingReverseAddresses = $state(false);
    let abortController: AbortController | null = null;

    // Local copies of service variables for binding
    let localIotaNamesPackageId = $state(config.IOTA_NAMES_PACKAGE_ID);
    let packageIds = $state({ ...config });

    // Registry sizes
    let registrySize = $state<number | null>(null);
    let reverseRegistrySize = $state<number | null>(null);

    async function updatePackageIdForNetwork() {
        getIotaNamesPackageId();
        localIotaNamesPackageId = config.IOTA_NAMES_PACKAGE_ID;
        packageIds = { ...config };

        // Fetch registry sizes
        try {
            const dynamicFields = await getDynamicFields();
            const nodes = dynamicFields.data.owner.dynamicFields.nodes;
            const registryNode = nodes.find((node: any) =>
                node.name.type.repr.includes('::registry::Registry'),
            );
            if (registryNode && registryNode.value.json) {
                registrySize = parseInt(registryNode.value.json.registry.size, 10);
                reverseRegistrySize = parseInt(registryNode.value.json.reverse_registry.size, 10);
            } else {
                registrySize = null;
                reverseRegistrySize = null;
            }
        } catch (err) {
            console.error('Error fetching dynamic fields:', err);
            registrySize = null;
            reverseRegistrySize = null;
        }
    }

    onMount(async () => {
        await updatePackageIdForNetwork();
    });

    // React to network changes
    $effect(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        $sharedClientConfig.selected;
        updatePackageIdForNetwork();
    });

    // Wrapper functions to handle UI state updates
    const handleResolveAddress = async () => {
        try {
            value = await resolveAddress(nameName);
        } catch (err: any) {
            value = err.toString();
        }
    };

    const handleResolveName = async () => {
        try {
            value = await resolveName(address);
        } catch (err: any) {
            value = err.toString();
        }
    };

    const handleGetRegistryEntry = async () => {
        try {
            value = await getRegistryEntry(nameName);
        } catch (err: any) {
            value = err.toString();
        }
    };

    const handleListRegisteredNames = async () => {
        try {
            // Cancel any existing fetch
            if (abortController) {
                abortController.abort();
            }

            // Create new abort controller
            abortController = new AbortController();
            isFetchingNames = true;

            // Start with empty result to show loading state
            value = { total: 0, names: [], registrations: [], loading: true };

            // Fetch all names progressively, updating UI after each page
            const finalResult = await listRegisteredNames((progressResult) => {
                // Update UI with current progress
                value = { ...progressResult, loading: true };
            }, abortController.signal);

            // Final update with complete result
            value = { ...finalResult, loading: false };
        } catch (err: any) {
            if (err.name === 'AbortError' || err.message === 'Operation cancelled') {
                value = { ...value, loading: false, cancelled: true };
            } else {
                value = err.toString();
            }
        } finally {
            isFetchingNames = false;
            abortController = null;
        }
    };

    const handleGetReverseRegisteredAddresses = async () => {
        try {
            // Cancel any existing fetch
            if (abortController) {
                abortController.abort();
            }

            // Create new abort controller
            abortController = new AbortController();
            isFetchingReverseAddresses = true;

            // Start with empty result to show loading state
            value = { total: 0, reverseRegistry: [], loading: true };

            // Fetch all reverse addresses progressively, updating UI after each page
            const finalResult = await getReverseRegisteredAddresses((progressResult) => {
                // Update UI with current progress
                value = { ...progressResult, loading: true };
            }, abortController.signal);

            // Final update with complete result
            value = { ...finalResult, loading: false };
        } catch (err: any) {
            if (err.name === 'AbortError' || err.message === 'Operation cancelled') {
                value = { ...value, loading: false, cancelled: true };
            } else {
                value = err.toString();
            }
        } finally {
            isFetchingReverseAddresses = false;
            abortController = null;
        }
    };

    const handleGetDynamicFields = async () => {
        try {
            value = await getDynamicFields();
        } catch (err: any) {
            value = err.toString();
        }
    };

    const handleToggleIotaNamesIds = async () => {
        showIotaNamesIds = !showIotaNamesIds;
        if (showIotaNamesIds) {
            try {
                await getPackageIds();
                packageIds = { ...config };
            } catch (err: any) {
                value = 'Error loading package IDs: ' + err.toString();
                console.error('Error in getPackageIds:', err);
            }
        }
    };

    const handleRegisterName = async () => {
        try {
            value = await registerName(nameName, $activeAddress);
        } catch (err: any) {
            value = err.toString();
        }
    };

    const handleSetTargetAddress = async () => {
        try {
            value = await setTargetAddress(nameName, address);
        } catch (err: any) {
            value = err.toString();
        }
    };

    const handleSetReverseLookup = async () => {
        try {
            value = await setReverseLookup(nameName);
        } catch (err: any) {
            value = err.toString();
        }
    };

    const handleStartAuctionAndPlaceBid = async () => {
        try {
            value = await startAuctionAndPlaceBid(nameName, bidPrice);
        } catch (err: any) {
            value = err.toString();
        }
    };

    const handlePlaceBid = async () => {
        try {
            value = await placeBid(nameName, bidPrice);
        } catch (err: any) {
            value = err.toString();
        }
    };

    const handleClaim = async () => {
        try {
            value = await claim(nameName, $activeAddress);
        } catch (err: any) {
            value = err.toString();
        }
    };

    const handleCancelFetch = () => {
        if (abortController) {
            abortController.abort();
        }
    };

    const handleListAuctions = async () => {
        try {
            value = await listAuctions();
        } catch (err: any) {
            value = err.toString();
        }
    };
</script>

<div class="container">
    <div class="toolbar" style="margin-bottom: 0.5rem;">
        {#if registrySize !== null && reverseRegistrySize !== null}
            <div
                style="display: flex; gap: 1.5rem; padding-right: 1rem; border-right: 1px solid var(--border-color); align-items: center;"
            >
                <div style="display: flex; flex-direction: column;">
                    <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 500;"
                        >Registered Names</span
                    >
                    <span style="font-family: monospace; font-weight: 600; color: #4ade80;"
                        >{registrySize}</span
                    >
                </div>
                <div style="display: flex; flex-direction: column;">
                    <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 500;"
                        >Reverse Lookups</span
                    >
                    <span style="font-family: monospace; font-weight: 600; color: #4ade80;"
                        >{reverseRegistrySize}</span
                    >
                </div>
            </div>
        {/if}

        <div class="toolbar-group">
            <label for="package-id">IotaNames Package ID</label>
            <input
                id="package-id"
                bind:value={localIotaNamesPackageId}
                onchange={() => {
                    setCustomPackageId(localIotaNamesPackageId);
                }}
                placeholder="package id 0x..."
            />
        </div>
        <div style="display: flex; gap: 0.5rem; align-self: flex-end;">
            <button onclick={handleToggleIotaNamesIds}>
                {showIotaNamesIds ? 'hide' : 'show'} package ids
            </button>
            <button onclick={handleGetDynamicFields}> get dynamic fields </button>
        </div>
    </div>

    {#if showIotaNamesIds}
        <div class="card" style="margin-bottom: 0.5rem;">
            <div class="card-header">
                <h3>IOTA-Names Details</h3>
            </div>
            <div class="card-body" style="font-family: monospace; font-size: 0.85rem;">
                <div>IotaNames Object ID: {packageIds.IOTA_NAMES_OBJECT_ID}</div>
                {#each [['Payments', packageIds.PAYMENTS_PACKAGE_ID], ['Subname', packageIds.SUBNAME_PACKAGE_ID], ['Subname Proxy', packageIds.SUBNAME_PROXY_PACKAGE_ID], ['Auction', packageIds.AUCTION_PACKAGE_ID], ['Coupons', packageIds.COUPONS_PACKAGE_ID]] as item}
                    {#if item[1] && item[1].length != 0}
                        <div>{item[0]} Package ID: {item[1]}</div>
                    {/if}
                {/each}
            </div>
        </div>
    {/if}

    <div class="toolbar" style="margin-bottom: 1rem;">
        <div class="toolbar-group">
            <label for="address">Address</label>
            <input id="address" bind:value={address} placeholder="0x..." />
        </div>
        <div class="toolbar-group">
            <label for="name">Name</label>
            <input id="name" bind:value={nameName} placeholder="name.iota" />
        </div>
        <div class="toolbar-group" style="min-width: 300px;">
            <IotaAmountInput
                id="bid-price"
                label="Bid Price"
                bind:value={bidPrice}
                placeholder="0"
            />
        </div>
    </div>

    <div
        style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1rem;"
    >
        <div class="card">
            <div class="card-header">
                <h3>Resolver</h3>
            </div>
            <div class="card-body actions">
                <button onclick={handleGetRegistryEntry}> get registry entry (by name) </button>
                <button onclick={handleResolveName}> resolve name (by address) </button>
                <button onclick={handleResolveAddress}> resolve address (by name) </button>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h3>Account & Actions</h3>
            </div>
            <div class="card-body actions">
                <button onclick={handleRegisterName}> register name </button>
                <button onclick={handleSetTargetAddress}> set target address </button>
                <button onclick={handleSetReverseLookup}> set reverse lookup </button>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h3>Auction</h3>
            </div>
            <div class="card-body actions">
                <button onclick={handleStartAuctionAndPlaceBid}>
                    start auction and place bid
                </button>
                <button onclick={handlePlaceBid}> place bid </button>
                <button onclick={handleClaim}> claim </button>
                <button onclick={handleListAuctions}> list auctions </button>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h3>Debug & Tools</h3>
            </div>
            <div class="card-body actions">
                {#if isFetchingNames}
                    <button onclick={handleCancelFetch} class="danger">
                        Cancel fetching names
                    </button>
                {:else}
                    <button onclick={handleListRegisteredNames}> list registered names </button>
                {/if}

                {#if isFetchingReverseAddresses}
                    <button onclick={handleCancelFetch} class="danger">
                        Cancel fetching reverse addresses
                    </button>
                {:else}
                    <button onclick={handleGetReverseRegisteredAddresses}>
                        get reverse registered addresses
                    </button>
                {/if}
            </div>
        </div>
    </div>

    {#if value?.names}
        <div class="table-container scrollable">
            <table class="data-table">
                <thead style="position: sticky; top: 0; z-index: 10;">
                    <tr>
                        <th
                            colspan="3"
                            style="background: var(--background-card); border-bottom: 1px solid var(--border-color); padding: 0.75rem 1rem;"
                        >
                            <div
                                style="display: flex; justify-content: space-between; align-items: center;"
                            >
                                <h3 style="margin: 0; font-size: 1rem; color: var(--text-muted);">
                                    Registered Names ({value.total})
                                </h3>
                                {#if value.loading}
                                    <div class="badge">Loading...</div>
                                {/if}
                            </div>
                        </th>
                    </tr>
                    <tr style="background: var(--background-card);">
                        <th style="min-width: 250px;">Name</th>
                        <th>Target Address</th>
                        <th style="min-width: 100px;">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {#if value.registrations && value.registrations.length > 0}
                        {#each value.registrations as reg, i}
                            <tr>
                                <td style="white-space: nowrap;">{value.names[i]}</td>
                                <td
                                    style="font-family: monospace; font-size: 0.8rem; white-space: nowrap; word-break: normal;"
                                >
                                    {reg.value?.json?.target_address || '-'}
                                </td>
                                <td>
                                    <button
                                        style="padding: 0.2rem 0.5rem; font-size: 0.8rem;"
                                        onclick={() => {
                                            nameName = value.names[i];
                                            handleGetRegistryEntry();
                                        }}
                                    >
                                        Details
                                    </button>
                                </td>
                            </tr>
                        {/each}
                    {:else}
                        {#each value.names as name}
                            <tr>
                                <td style="white-space: nowrap;">{name}</td>
                                <td>-</td>
                                <td>
                                    <button
                                        style="padding: 0.2rem 0.5rem; font-size: 0.8rem;"
                                        onclick={() => {
                                            nameName = name;
                                            handleGetRegistryEntry();
                                        }}
                                    >
                                        Details
                                    </button>
                                </td>
                            </tr>
                        {/each}
                    {/if}
                </tbody>
            </table>
        </div>
    {/if}

    {#if value?.reverseRegistry}
        <div class="table-container scrollable">
            <table class="data-table">
                <thead style="position: sticky; top: 0; z-index: 10;">
                    <tr>
                        <th
                            colspan="2"
                            style="background: var(--background-card); border-bottom: 1px solid var(--border-color); padding: 0.75rem 1rem;"
                        >
                            <div
                                style="display: flex; justify-content: space-between; align-items: center;"
                            >
                                <h3 style="margin: 0; font-size: 1rem; color: var(--text-muted);">
                                    Reverse Registered Addresses ({value.total})
                                </h3>
                                {#if value.loading}
                                    <div class="badge">Loading...</div>
                                {/if}
                            </div>
                        </th>
                    </tr>
                    <tr style="background: var(--background-card);">
                        <th>Address</th>
                        <th style="min-width: 250px;">Name</th>
                    </tr>
                </thead>
                <tbody>
                    {#each value.reverseRegistry as entry}
                        <tr>
                            <td
                                style="font-family: monospace; font-size: 0.8rem; white-space: nowrap; word-break: normal;"
                                >{entry.address}</td
                            >
                            <td style="white-space: nowrap;">{entry.name}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {/if}

    <TransactionView {value} />
</div>

<style>
    /* Styles are now mostly shared via common-pages.css */
</style>

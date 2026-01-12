<script lang="ts">
    import { onMount } from 'svelte';

    import TransactionView from '../../components/TransactionView.svelte';
    import { getSelectedNetworkConfig } from '../../utils/client';
    import { sharedClientConfig } from '../../utils/local-storage-store';
    import { activeAddress } from '../../utils/signer-data';
    import {
        claim,
        config,
        getDynamicFields,
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
        setDevnetPackageId,
        setMainnetPackageId,
        setReverseLookup,
        setTargetAddress,
        setTestnetPackageId,
        startAuctionAndPlaceBid,
    } from './iota-names-service';

    let address = '0x0000a4984bd495d4346fa208ddff4f5d5e5ad48c21dec631ddebc99809f16900';
    let nameName = 'name.iota';
    let bidPrice = 10000000;
    let showIotaNamesIds = false;
    // Will be updated with the result
    let value = {};
    // Track if fetching is in progress
    let isFetchingNames = false;
    let abortController: AbortController | null = null;

    // Local copies of service variables for binding
    let localIotaNamesPackageId = config.IOTA_NAMES_PACKAGE_ID;
    let packageIds = { ...config };

    function updatePackageIdForNetwork() {
        const network = getSelectedNetworkConfig();
        if (network.name === 'mainnet') {
            setMainnetPackageId();
        } else if (network.name === 'testnet') {
            setTestnetPackageId();
        } else if (network.name === 'devnet') {
            setDevnetPackageId();
        } else if (network.name === 'localnet') {
            setCustomPackageId('');
        }
        localIotaNamesPackageId = config.IOTA_NAMES_PACKAGE_ID;
        packageIds = { ...config };
    }

    onMount(() => {
        updatePackageIdForNetwork();
    });

    // React to network changes
    $: ($sharedClientConfig.selected, updatePackageIdForNetwork());

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
            value = await getReverseRegisteredAddresses();
        } catch (err: any) {
            value = err.toString();
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
        showIotaNamesIds = true;
        try {
            await getPackageIds();
            packageIds = { ...config };
            console.log('Package IDs loaded:', config);
        } catch (err: any) {
            value = 'Error loading package IDs: ' + err.toString();
            console.error('Error in getPackageIds:', err);
        }
        // open the details element
        document.querySelector('details')?.setAttribute('open', 'true');
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

<main>
    <span>
        IotaNames package id:
        <input
            bind:value={localIotaNamesPackageId}
            onchange={() => {
                setCustomPackageId(localIotaNamesPackageId);
            }}
            placeholder="package id 0x..."
            size="67"
        />
    </span>
    <br />
    <br />
    <span>
        address:
        <input bind:value={address} placeholder="address 0x..." size="67" />
    </span>
    <span>
        name:
        <input bind:value={nameName} placeholder="name.iota" />
    </span>
    <br />
    <br />

    {#if showIotaNamesIds}
        <details>
            <summary>IOTA-Names IDs</summary>
            <div>
                IotaNames Object ID: {packageIds.IOTA_NAMES_OBJECT_ID}
                <br />
                {#each [['Payments', packageIds.PAYMENTS_PACKAGE_ID], ['Subname', packageIds.SUBNAME_PACKAGE_ID], ['Subname Proxy', packageIds.SUBNAME_PROXY_PACKAGE_ID], ['Auction', packageIds.AUCTION_PACKAGE_ID], ['Coupons', packageIds.COUPONS_PACKAGE_ID]] as item}
                    {#if item[1] && item[1].length != 0}
                        {item[0]} Package ID: {item[1]}
                        <br />
                    {/if}
                {/each}
            </div>
        </details>
    {/if}

    General information:
    {#if isFetchingNames}
        <button onclick={handleCancelFetch} style="background-color: #ff6b6b; color: white;"
            >Cancel fetching names</button
        >
    {:else}
        <button onclick={handleListRegisteredNames}> list registered names </button>
    {/if}
    <button onclick={handleGetReverseRegisteredAddresses}>
        get reverse registered addresses
    </button>
    <button onclick={handleToggleIotaNamesIds}> show package ids </button>
    <button onclick={handleGetDynamicFields}> get dynamic fields </button>
    <hr />
    Resolver:
    <button onclick={handleGetRegistryEntry}> get registry entry (by name) </button>
    <button onclick={handleResolveName}> resolve name (by address) </button>
    <button onclick={handleResolveAddress}> resolve address (by name) </button>
    <hr />
    Tx actions:
    <button onclick={handleRegisterName}> register name </button>
    <button onclick={handleSetTargetAddress}> set target address </button>
    <button onclick={handleSetReverseLookup}> set reverse lookup </button>
    <hr />
    Auction:
    <span>
        bid price:
        <input bind:value={bidPrice} type="number" placeholder="0" style="width: 14rem;" />
    </span>
    <button onclick={handleStartAuctionAndPlaceBid}> start auction and place bid </button>
    <button onclick={handlePlaceBid}> place bid </button>
    <button onclick={handleClaim}> claim </button>
    <button onclick={handleListAuctions}> list auctions </button>

    <TransactionView {value} />
</main>

<style>
    button {
        margin: 0.5rem;
    }
</style>

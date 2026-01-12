<script lang="ts">
    import { IotaGraphQLClient } from '@iota/iota-sdk/graphql';
    import { normalizeIotaAddress } from '@iota/iota-sdk/utils';
    import { onMount } from 'svelte';

    import { getSelectedNetworkConfig } from '../lib/client';
    import {
        queryDynamicFields,
        type DynamicFieldsResult,
    } from '../lib/dynamic-fields/dynamic-fields-utils';
    import { getAddressLink, getObjectLink, getTransactionLink } from '../lib/explorer-links';
    import { updatePageQueryParams, usePageQueryParams } from '../lib/page-query-params';

    // Query parameter integration
    const queryParamDefaults = {
        objectInput: '',
        pageSize: '1',
    };

    const pageParams = usePageQueryParams(queryParamDefaults);

    let objectInputTextarea: HTMLInputElement;
    let objectInput = '';
    let pageSize = $state('1');
    let currentInputType = $state<'hex' | 'type' | null>(null);
    let objectData = $state<any>(null);
    let objectsList = $state<any[]>([]);
    let packageTypes = $state<any[]>([]);
    let error = $state('');
    let loading = $state(false);
    let mode = $state<'single' | 'list' | 'package'>('single');

    // GraphQL pagination for list mode
    let currentCursor = $state<string | null>(null);
    let hasNext = $state(false);
    let loadingNext = $state(false);

    // Dynamic fields state
    let dynamicFieldsMap = $state<Map<string, any[]>>(new Map());
    let dynamicFieldsLoading = $state<Map<string, boolean>>(new Map());
    let dynamicFieldsInitiallyOpen = $state<Map<string, boolean>>(new Map());

    function detectInputType(input: string): 'hex' | 'type' | null {
        const trimmed = input.trim();

        // Check if it's a hex address (0x followed by hex characters)
        if (/^0x[0-9a-fA-F]+$/.test(trimmed)) {
            return 'hex';
        }

        // Check if it's a type (contains ::)
        if (trimmed.includes('::')) {
            return 'type';
        }

        return null;
    }

    async function fetchSingleObject(objectId: string) {
        try {
            loading = true;
            error = '';

            const config = getSelectedNetworkConfig();
            const graphqlClient = new IotaGraphQLClient({
                url: config.graphql,
            });

            const result = await graphqlClient.query({
                query: `
                    query GetObject($id: IotaAddress!) {
                        object(address: $id) {
                            address
                            owner {
                                ... on AddressOwner {
                                    owner {
                                        address
                                    }
                                }
                                ... on Shared {
                                    initialSharedVersion
                                }
                            }
                            previousTransactionBlock {
                                digest
                            }
                            asMoveObject {
                                contents {
                                    type {
                                        repr
                                    }
                                    json
                                }
                            }
                            asMovePackage {
                                modules {
                                    nodes {
                                        name
                                    }
                                }
                            }
                        }
                    }
                `,
                variables: {
                    id: objectId,
                },
            });

            const obj = result.data?.object;
            if (!obj) {
                error = 'Object not found';
                objectData = null;
                return;
            }

            objectData = obj;
            objectsList = [];
            packageTypes = [];
            mode = 'single';
        } catch (e: any) {
            error = `Failed to fetch object: ${e.message || e}`;
            objectData = null;
        } finally {
            loading = false;
        }
    }

    async function queryDynamicFieldsForObject(objectId: string) {
        dynamicFieldsLoading.set(objectId, true);
        dynamicFieldsLoading = new Map(dynamicFieldsLoading); // Trigger reactivity

        const result: DynamicFieldsResult = await queryDynamicFields({
            objectId,
            pageSize: 50,
            graphqlUrl: getSelectedNetworkConfig().graphql,
        });

        if (result.error) {
            console.error('Error fetching dynamic fields:', result.error);
            dynamicFieldsMap.set(objectId, []);
        } else {
            dynamicFieldsMap.set(objectId, result.nodes);
            // Mark as initially open when first loaded
            dynamicFieldsInitiallyOpen.set(objectId, true);
        }

        dynamicFieldsLoading.set(objectId, false);
        dynamicFieldsLoading = new Map(dynamicFieldsLoading); // Trigger reactivity
        dynamicFieldsMap = new Map(dynamicFieldsMap); // Trigger reactivity
        dynamicFieldsInitiallyOpen = new Map(dynamicFieldsInitiallyOpen); // Trigger reactivity
    }

    async function fetchObjectsByType(type: string, cursor: string | null = null) {
        try {
            loading = true;
            error = '';

            const config = getSelectedNetworkConfig();
            const graphqlClient = new IotaGraphQLClient({
                url: config.graphql,
            });

            const result = await graphqlClient.query({
                query: `
                    query GetObjects($type: String!, $cursor: String, $first: Int!) {
                        objects(filter: { type: $type }, after: $cursor, first: $first) {
                            nodes {
                                address
                                owner {
                                    ... on AddressOwner {
                                        owner {
                                            address
                                        }
                                    }
                                    ... on Shared {
                                        initialSharedVersion
                                    }
                                }
                                previousTransactionBlock {
                                    digest
                                }
                                asMoveObject {
                                    contents {
                                        type {
                                            repr
                                        }
                                        json
                                    }
                                }
                            }
                            pageInfo {
                                hasNextPage
                                endCursor
                            }
                        }
                    }
                `,
                variables: {
                    type,
                    cursor,
                    first: parseInt(pageSize),
                },
            });

            const objects = result.data?.objects as any;
            if (!objects || !objects.nodes) {
                error = 'No objects found';
                objectsList = [];
                return;
            }

            if (cursor) {
                // Append to existing list
                const startIndex = objectsList.length;
                objectsList = [...objectsList, ...objects.nodes];
                // Expand newly added objects if expand all was clicked
                if (allExpanded) {
                    objects.nodes.forEach((_: any, i: number) => {
                        expandedObjects[startIndex + i] = true;
                    });
                }
            } else {
                // New search - reset expand all state
                objectsList = objects.nodes;
                expandedObjects = {};
                allExpanded = false;
            }

            currentCursor = objects.pageInfo.endCursor;
            hasNext = objects.pageInfo.hasNextPage;
            objectData = null;
            if (mode !== 'package') {
                packageTypes = [];
                mode = 'list';
            }
        } catch (e: any) {
            error = `Failed to fetch objects: ${e.message || e}`;
            objectsList = [];
        } finally {
            loading = false;
        }
    }

    async function fetchPackageTypes(packageId: string) {
        try {
            loading = true;
            error = '';

            const config = getSelectedNetworkConfig();
            const graphqlClient = new IotaGraphQLClient({
                url: config.graphql,
            });

            const result = await graphqlClient.query({
                query: `
                    query GetPackage($address: IotaAddress!) {
                        package(address: $address) {
                            address
                            modules {
                                nodes {
                                    name
                                    structs {
                                        nodes {
                                            name
                                            abilities
                                            typeParameters {
                                                constraints
                                            }
                                            fields {
                                                name
                                                type {
                                                    repr
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                `,
                variables: {
                    address: packageId,
                },
            });

            const pkg = result.data?.package as any;
            if (!pkg) {
                // Not a package, return empty
                packageTypes = [];
                return;
            }

            // Extract all types from modules
            const types: any[] = [];
            if (pkg.modules && pkg.modules.nodes) {
                pkg.modules.nodes.forEach((module: any) => {
                    if (module.structs && module.structs.nodes) {
                        module.structs.nodes.forEach((struct: any) => {
                            // Only include structs with KEY ability
                            if (struct.abilities && struct.abilities.includes('KEY')) {
                                types.push({
                                    fullType: `${pkg.address}::${module.name}::${struct.name}`,
                                    displayType: `${module.name}::${struct.name}`,
                                    module: module.name,
                                    name: struct.name,
                                    abilities: struct.abilities,
                                    fields: struct.fields,
                                });
                            }
                        });
                    }
                });
            }

            packageTypes = types;
            objectData = null;
            objectsList = [];
            mode = 'package';
        } catch (e: any) {
            // Not a package, rethrow to try as object
            throw e;
        } finally {
            loading = false;
        }
    }

    async function processInput() {
        const input = objectInput.trim();
        if (!input) {
            error = 'Please enter object ID, type, or package ID';
            return;
        }

        const type = detectInputType(input);
        currentInputType = type;

        if (!type) {
            error = 'Invalid input format. Expected hex address (0x...) or type (containing ::)';
            return;
        }

        if (type === 'hex') {
            // Try object first (faster)
            try {
                await fetchSingleObject(input);
                // If it's a package (has asMovePackage), fetch package types
                if (objectData && objectData.asMovePackage) {
                    await fetchPackageTypes(input);
                } else {
                    updatePageQueryParams({ objectInput: input });
                }
                return;
            } catch (e) {
                // Not an object, try as package
                await fetchPackageTypes(input);
            }
        } else if (type === 'type') {
            await fetchObjectsByType(input);
        }

        updatePageQueryParams({ objectInput: input });
    }

    async function loadNextPage() {
        if (!currentCursor || !hasNext) return;

        try {
            loadingNext = true;
            const input = objectInput.trim();
            await fetchObjectsByType(input, currentCursor);
        } finally {
            loadingNext = false;
        }
    }

    async function searchType(type: string) {
        objectInput = type;
        if (objectInputTextarea) {
            objectInputTextarea.value = type;
        }
        await fetchObjectsByType(type);
        updatePageQueryParams({ objectInput: type });
    }

    function handlePageSizeChange() {
        updatePageQueryParams({ pageSize });
    }

    const loadExample = async (example: string) => {
        if (objectInputTextarea) {
            objectInputTextarea.value = example;
            objectInput = example;
            updatePageQueryParams({ objectInput: example });
            // Automatically process the example
            await processInput();
        }
    };

    // Initialize from query parameters
    onMount(() => {
        const params = $pageParams;
        if (params.objectInput && objectInputTextarea) {
            objectInputTextarea.value = params.objectInput;
            const event = new Event('input', { bubbles: true });
            objectInputTextarea.dispatchEvent(event);
        }
        pageSize = params.pageSize;
    });

    let expandedObjects = $state<Record<number, boolean>>({});
    let singleObjectExpanded = $state(true);
    let inputTimeout = $state<ReturnType<typeof setTimeout> | null>(null);
    let allExpanded = $state(false);

    function expandAllObjects() {
        objectsList.forEach((_, i) => (expandedObjects[i] = true));
        allExpanded = true;
    }

    function collapseAllObjects() {
        expandedObjects = {};
        allExpanded = false;
    }

    function handleInput(event: Event) {
        const target = event.target as HTMLInputElement;
        objectInput = target.value;
        updatePageQueryParams({ objectInput: objectInput });

        // Clear existing timeout
        if (inputTimeout) {
            clearTimeout(inputTimeout);
        }

        // Debounce the processing to avoid processing on every keystroke
        if (objectInput.trim()) {
            inputTimeout = setTimeout(() => {
                processInput();
            }, 500);
        } else {
            // Clear data if input is empty
            objectData = null;
            objectsList = [];
            packageTypes = [];
            error = '';
        }
    }
</script>

<div class="object-page">
    <h3>Object Viewer</h3>

    <div class="input-section">
        <div class="input-header">
            <label for="object-input">Object ID (hex), Object Type, or Package ID:</label>
            <div class="examples-section">
                <span>Examples:</span>
                <div class="button-group">
                    <button onclick={() => loadExample('0x2')}> IOTA Framework </button>
                    <button onclick={() => loadExample('0x3')}> System Package </button>
                    <button onclick={() => loadExample(normalizeIotaAddress('0x6'))}>
                        Clock Object
                    </button>
                    <button
                        onclick={() =>
                            loadExample(
                                '0x7fff6e95f385349bec98d17121ab2bfa3e134f2f0b1ccefc270313415f7835ea',
                            )}
                    >
                        IOTA-Names testnet
                    </button>
                    <button
                        onclick={() =>
                            loadExample(
                                '0x6d2c743607ef275bd6934fe5c2a7e5179cca6fbd2049cfa79de2310b74f3cf83',
                            )}
                    >
                        IOTA-Names mainnet
                    </button>
                </div>
            </div>
        </div>
        <input
            type="text"
            id="object-input"
            bind:this={objectInputTextarea}
            placeholder="Enter object ID (0x...), type (0x2::coin::Coin), or package ID (0x...)"
            oninput={handleInput}
        />
    </div>

    {#if error}
        <div class="error-message">
            <strong>Error:</strong>
            {error}
        </div>
    {/if}

    {#if loading}
        <div class="loading-message">
            <div class="spinner"></div>
            <span>Loading...</span>
        </div>
    {/if}

    {#if mode === 'single' && objectData}
        <div class="objects-list">
            <h3>Object Details</h3>
            <div class="object-item">
                <details class="object-details" bind:open={singleObjectExpanded}>
                    <summary class="object-summary">
                        <code class="object-address">{objectData.address}</code>
                        <button
                            onclick={() =>
                                window.open(
                                    getObjectLink(getSelectedNetworkConfig(), objectData.address),
                                    '_blank',
                                )}
                            class="explorer-btn"
                        >
                            Explorer
                        </button>
                    </summary>
                    <div class="object-details-content">
                        {#if objectData.owner}
                            <div class="detail-row">
                                <strong>Owner:</strong>
                                <span>
                                    {#if objectData.owner.owner}
                                        <a
                                            href={getAddressLink(
                                                getSelectedNetworkConfig(),
                                                objectData.owner.owner.address ||
                                                    objectData.owner.owner,
                                            )}
                                            target="_blank"
                                            class="address-link"
                                        >
                                            {objectData.owner.owner.address ||
                                                objectData.owner.owner}
                                        </a>
                                    {:else if objectData.owner.initialSharedVersion}
                                        Shared (v{objectData.owner.initialSharedVersion})
                                    {:else}
                                        {JSON.stringify(objectData.owner)}
                                    {/if}
                                </span>
                            </div>
                        {/if}
                        {#if objectData.previousTransactionBlock}
                            <div class="detail-row">
                                <strong>Last tx:</strong>
                                <span>
                                    <a
                                        href={getTransactionLink(
                                            getSelectedNetworkConfig(),
                                            objectData.previousTransactionBlock.digest,
                                        )}
                                        target="_blank"
                                        class="address-link"
                                    >
                                        {objectData.previousTransactionBlock.digest}
                                    </a>
                                </span>
                            </div>
                        {/if}
                        {#if objectData.asMoveObject}
                            {#if currentInputType === 'hex'}
                                <div class="detail-row">
                                    <strong>Type:</strong>
                                    <code
                                        >{objectData.asMoveObject.contents.type?.repr ||
                                            'Unknown'}</code
                                    >
                                </div>
                            {/if}
                            <div class="detail-row">
                                <strong>Contents:</strong>
                                <button
                                    onclick={() => queryDynamicFieldsForObject(objectData.address)}
                                    disabled={dynamicFieldsLoading.get(objectData.address) || false}
                                    class="dynamic-fields-btn"
                                >
                                    {dynamicFieldsLoading.get(objectData.address)
                                        ? 'Loading...'
                                        : dynamicFieldsMap.has(objectData.address)
                                          ? `Query Dynamic Fields: ${dynamicFieldsMap.get(objectData.address)?.length ?? 0}`
                                          : 'Query Dynamic Fields'}
                                </button>
                            </div>
                            <pre class="json-content">{JSON.stringify(
                                    objectData.asMoveObject.contents.json,
                                    null,
                                    2,
                                )}</pre>
                            {#if objectData.address && (dynamicFieldsMap.get(objectData.address)?.length ?? 0) > 0}
                                <details
                                    class="dynamic-fields-details"
                                    open={dynamicFieldsInitiallyOpen.get(objectData.address) ||
                                        false}
                                >
                                    <summary class="dynamic-fields-summary">
                                        <strong
                                            >Dynamic Fields ({dynamicFieldsMap.get(
                                                objectData.address,
                                            )!.length})</strong
                                        >
                                    </summary>
                                    <pre class="json-content">{JSON.stringify(
                                            dynamicFieldsMap.get(objectData.address)!,
                                            null,
                                            2,
                                        )}</pre>
                                </details>
                            {/if}
                        {/if}
                    </div>
                </details>
            </div>
        </div>
    {/if}

    {#if packageTypes.length > 0}
        <div class="package-types">
            <h3>Package Types</h3>
            <div class="package-id">
                <strong>Package:</strong>
                <code>{packageTypes[0]?.fullType.split('::').slice(0, 1).join('')}</code>
            </div>
            <p>Click on a type to search for objects of that type:</p>
            <div class="types-list">
                {#each packageTypes as type}
                    <button class="type-btn" onclick={() => searchType(type.fullType)}>
                        <code>{type.displayType}</code>
                    </button>
                {/each}
            </div>
        </div>
    {/if}

    {#if objectsList.length > 0}
        <div class="objects-list">
            <div class="objects-header">
                <div class="header-controls">
                    <div class="expand-controls">
                        <button onclick={expandAllObjects}>Expand All</button>
                        <button onclick={collapseAllObjects}>Collapse All</button>
                    </div>
                    {#if hasNext}
                        <button onclick={loadNextPage} disabled={loadingNext} class="load-more-btn">
                            {loadingNext ? 'Loading...' : 'Load More'}
                        </button>
                    {/if}
                    <div class="page-size-control">
                        <label for="page-size">Page Size:</label>
                        <select
                            id="page-size"
                            bind:value={pageSize}
                            onchange={handlePageSizeChange}
                        >
                            <option value="1">1</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                        </select>
                    </div>
                </div>
                <h3>Objects ({objectsList.length})</h3>
            </div>
            {#each objectsList as obj, i}
                <div class="object-item">
                    <details class="object-details" bind:open={expandedObjects[i]}>
                        <summary class="object-summary">
                            <code class="object-address">{obj.address}</code>
                            <button
                                onclick={() =>
                                    window.open(
                                        getObjectLink(getSelectedNetworkConfig(), obj.address),
                                        '_blank',
                                    )}
                                class="explorer-btn"
                            >
                                Explorer
                            </button>
                        </summary>
                        <div class="object-details-content">
                            {#if obj.owner}
                                <div class="detail-row">
                                    <strong>Owner:</strong>
                                    <span>
                                        {#if obj.owner.owner}
                                            <a
                                                href={getAddressLink(
                                                    getSelectedNetworkConfig(),
                                                    obj.owner.owner.address || obj.owner.owner,
                                                )}
                                                target="_blank"
                                                class="address-link"
                                            >
                                                {obj.owner.owner.address || obj.owner.owner}
                                            </a>
                                        {:else if obj.owner.initialSharedVersion}
                                            Shared (v{obj.owner.initialSharedVersion})
                                        {:else}
                                            {JSON.stringify(obj.owner)}
                                        {/if}
                                    </span>
                                </div>
                            {/if}
                            {#if obj.previousTransactionBlock}
                                <div class="detail-row">
                                    <strong>Last tx:</strong>
                                    <span>
                                        <a
                                            href={getTransactionLink(
                                                getSelectedNetworkConfig(),
                                                obj.previousTransactionBlock.digest,
                                            )}
                                            target="_blank"
                                            class="address-link"
                                        >
                                            {obj.previousTransactionBlock.digest}
                                        </a>
                                    </span>
                                </div>
                            {/if}
                            {#if obj.asMoveObject}
                                {#if currentInputType === 'hex'}
                                    <div class="detail-row">
                                        <strong>Type:</strong>
                                        <code
                                            >{obj.asMoveObject.contents.type?.repr ||
                                                'Unknown'}</code
                                        >
                                    </div>
                                {/if}
                                <div class="detail-row">
                                    <strong>Contents:</strong>
                                    <button
                                        onclick={() => queryDynamicFieldsForObject(obj.address)}
                                        disabled={dynamicFieldsLoading.get(obj.address) || false}
                                        class="dynamic-fields-btn"
                                    >
                                        {dynamicFieldsLoading.get(obj.address)
                                            ? 'Loading...'
                                            : dynamicFieldsMap.has(obj.address)
                                              ? `Query Dynamic Fields: ${dynamicFieldsMap.get(obj.address)?.length ?? 0}`
                                              : 'Query Dynamic Fields'}
                                    </button>
                                </div>
                                <pre class="json-content">{JSON.stringify(
                                        obj.asMoveObject.contents.json,
                                        null,
                                        2,
                                    )}</pre>
                                {#if obj.address && (dynamicFieldsMap.get(obj.address)?.length ?? 0) > 0}
                                    <details
                                        class="dynamic-fields-details"
                                        open={dynamicFieldsInitiallyOpen.get(obj.address) || false}
                                    >
                                        <summary class="dynamic-fields-summary">
                                            <strong
                                                >Dynamic Fields ({dynamicFieldsMap.get(obj.address)!
                                                    .length})</strong
                                            >
                                        </summary>
                                        <pre class="json-content">{JSON.stringify(
                                                dynamicFieldsMap.get(obj.address)!,
                                                null,
                                                2,
                                            )}</pre>
                                    </details>
                                {/if}
                            {/if}
                        </div>
                    </details>
                </div>
            {/each}
            {#if hasNext}
                <button
                    onclick={loadNextPage}
                    disabled={loadingNext}
                    class="load-more-btn bottom-load-more"
                >
                    {loadingNext ? 'Loading...' : 'Load More'}
                </button>
            {/if}
        </div>
    {/if}
</div>

<style>
    .object-page {
        width: 100%;
        margin: 0 auto;
        padding: 0.5rem;
        min-height: 120vh;
    }

    h3 {
        color: rgba(255, 255, 255, 0.9);
        margin-bottom: 0.75rem;
        font-size: 1.25rem;
    }

    .input-section {
        margin-bottom: 1.5rem;
    }

    .input-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
        gap: 1rem;
    }

    .input-header label {
        margin-bottom: 0;
    }

    .examples-section {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex-shrink: 0;
    }

    .examples-section span {
        color: rgba(255, 255, 255, 0.85);
        font-weight: 500;
        font-size: 0.9rem;
    }

    .button-group {
        display: flex;
        gap: 0.5rem;
        flex-shrink: 0;
    }

    .address-link {
        color: rgba(59, 130, 246, 1);
        text-decoration: none;
        transition: color 0.2s;
    }

    .address-link:hover {
        color: rgba(59, 130, 246, 0.8);
        text-decoration: underline;
    }

    .header-controls .page-size-control {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: rgba(255, 255, 255, 0.85);
        font-weight: 500;
        font-size: 0.9rem;
    }

    .header-controls .page-size-control select {
        padding: 0.4rem 0.6rem;
        background: var(--primary-color);
        border: 1px solid var(--border-color);
        border-radius: 4px;
        color: white;
        font-size: 0.85rem;
        cursor: pointer;
    }

    .header-controls .page-size-control select:focus {
        outline: none;
        border-color: var(--accent-color);
    }

    label {
        display: block;
        margin-bottom: 0.5rem;
        color: rgba(255, 255, 255, 0.85);
        font-weight: 500;
    }

    input[type='text'] {
        width: 100%;
        padding: 0.5rem;
        margin-top: 0.25rem;
        background: rgba(30, 30, 40, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 6px;
        color: rgba(255, 255, 255, 0.9);
        font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
        font-size: 0.85rem;
    }

    input[type='text']:focus {
        outline: none;
        border-color: rgba(59, 130, 246, 0.5);
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .button-group {
        display: flex;
        gap: 0.75rem;
        flex-wrap: wrap;
    }

    button {
        background: var(--primary-color);
        border: 1px solid var(--border-color);
        color: white;
        padding: 0.4rem 0.8rem;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9rem;
        font-weight: 500;
        transition: all 0.2s;
    }

    button:hover:not(:disabled) {
        background: var(--primary-hover);
        border-color: var(--accent-color);
    }

    button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .error-message {
        padding: 0.75rem;
        margin-bottom: 1rem;
        background: rgba(220, 38, 38, 0.1);
        border: 1px solid rgba(220, 38, 38, 0.3);
        border-radius: 6px;
        color: #fca5a5;
    }

    .loading-message {
        padding: 1rem;
        margin-bottom: 1rem;
        background: rgba(59, 130, 246, 0.1);
        border: 1px solid rgba(59, 130, 246, 0.3);
        border-radius: 6px;
        color: rgba(59, 130, 246, 1);
        display: flex;
        align-items: center;
        gap: 1rem;
        font-weight: 500;
    }

    .spinner {
        width: 20px;
        height: 20px;
        border: 2px solid rgba(59, 130, 246, 0.3);
        border-top-color: rgba(59, 130, 246, 1);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    .objects-list,
    .package-types {
        margin-top: 1rem;
        padding: 0.75rem;
        background: rgba(30, 30, 40, 0.4);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
    }

    .objects-header {
        display: flex;
        align-items: center;
        margin-bottom: 1rem;
        position: relative;
    }

    .header-controls {
        display: flex;
        gap: 0.5rem;
        align-items: center;
    }

    .objects-header h3 {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        margin: 0;
    }

    .expand-controls {
        display: flex;
        gap: 0.5rem;
    }

    code {
        background: rgba(0, 0, 0, 0.3);
        padding: 0.25rem 0.5rem;
        border-radius: 3px;
        font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
        font-size: 0.85rem;
        color: rgba(255, 255, 255, 0.9);
        word-break: break-all;
    }

    .object-item {
        margin-bottom: 0.5rem;
        padding: 0.5rem;
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 4px;
    }

    .object-details {
        width: 100%;
    }

    .object-summary {
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 500;
        user-select: none;
        padding: 0;
        position: relative;
    }

    .object-summary::before {
        content: '▶';
        color: rgba(59, 130, 246, 1);
        font-size: 0.8rem;
        font-weight: bold;
        transition: transform 0.2s ease;
        display: inline-block;
        width: 1rem;
        text-align: center;
    }

    .object-details[open] .object-summary::before {
        content: '▼';
        transform: rotate(0deg);
    }

    .object-summary::-webkit-details-marker {
        display: none;
    }

    .object-summary::marker {
        display: none;
    }

    .object-address {
        font-size: 0.85rem;
        color: rgba(255, 255, 255, 0.9);
        user-select: text;
    }

    .explorer-btn {
        padding: 0.25rem 0.5rem;
        background-color: rgb(36, 47, 77);
        color: #ffffff;
        border: 1px solid #535353;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.85rem;
        font-weight: 500;
        transition: all 0.2s ease;
    }

    .explorer-btn:hover {
        background-color: rgb(56, 67, 97);
        border-color: #737373;
    }

    .object-details-content {
        margin-top: 0.5rem;
        padding-top: 0.5rem;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .dynamic-fields-details {
        margin-top: 0.5rem;
    }

    .dynamic-fields-summary {
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 500;
        user-select: none;
        padding: 0;
        position: relative;
        margin-bottom: 0.5rem;
    }

    .dynamic-fields-summary::before {
        content: '▶';
        color: rgba(59, 130, 246, 1);
        font-size: 0.8rem;
        font-weight: bold;
        transition: transform 0.2s ease;
        display: inline-block;
        width: 1rem;
        text-align: center;
    }

    .dynamic-fields-details[open] .dynamic-fields-summary::before {
        content: '▼';
        transform: rotate(0deg);
    }

    .dynamic-fields-summary::-webkit-details-marker {
        display: none;
    }

    .dynamic-fields-summary::marker {
        display: none;
    }

    .detail-row {
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
        align-items: baseline;
    }

    .detail-row strong {
        color: rgba(255, 255, 255, 0.9);
        font-weight: 600;
        font-size: 0.75rem;
        flex-shrink: 0;
    }

    .detail-row span {
        color: rgba(255, 255, 255, 0.7);
        font-size: 0.75rem;
        word-break: break-all;
    }

    .json-content {
        background: rgba(0, 0, 0, 0.3);
        padding: 0.5rem;
        border-radius: 3px;
        font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
        font-size: 0.7rem;
        color: rgba(255, 255, 255, 0.9);
        overflow-x: auto;
        white-space: pre-wrap;
        margin-top: 0.25rem;
        text-align: left;
    }

    .load-more-btn,
    .expand-controls button {
        background: var(--primary-color);
        border: 1px solid var(--border-color);
        color: white;
        padding: 0.4rem 0.8rem;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: all 0.2s;
        margin-top: 0;
    }

    .load-more-btn:hover:not(:disabled),
    .expand-controls button:hover {
        background: var(--primary-hover);
        border-color: var(--accent-color);
    }

    .load-more-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .bottom-load-more {
        margin-top: 0.5rem;
    }

    .package-id {
        margin-bottom: 0.5rem;
        padding: 0.5rem;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 4px;
    }

    .package-id strong {
        color: rgba(255, 255, 255, 0.9);
        margin-right: 0.5rem;
    }

    .type-btn {
        padding: 0.5rem 0.75rem;
        background: rgba(16, 185, 129, 0.15);
        border: 1px solid rgba(16, 185, 129, 0.3);
        border-radius: 6px;
        color: rgba(16, 185, 129, 1);
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        text-align: left;
    }

    .type-btn:hover {
        background: rgba(16, 185, 129, 0.25);
        border-color: rgba(16, 185, 129, 0.5);
    }

    .dynamic-fields-btn {
        margin-left: 0.5rem;
        padding: 0.25rem 0.5rem;
        background-color: rgb(36, 47, 77);
        color: #ffffff;
        border: 1px solid #535353;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.85rem;
        font-weight: 500;
        transition: all 0.2s ease;
    }

    .dynamic-fields-btn:hover:not(:disabled) {
        background-color: rgb(56, 67, 97);
        border-color: #737373;
    }

    .dynamic-fields-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    @media (max-width: 768px) {
        .object-page {
            padding: 0.5rem;
        }

        .object-address {
            font-size: 0.8rem;
        }

        .detail-row {
            font-size: 0.75rem;
        }

        .object-summary {
            gap: 0.25rem;
        }

        .json-content {
            word-break: break-all;
            overflow-wrap: break-word;
        }

        .input-header {
            flex-wrap: wrap;
            justify-content: flex-start;
        }

        .examples-section {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.25rem;
            flex-shrink: 1;
            min-width: 0;
        }

        .button-group {
            flex-wrap: wrap;
            width: 100%;
            flex-shrink: 1;
        }

        .button-group button {
            flex: 1;
            min-width: 120px;
            font-size: 0.8rem;
            padding: 0.3rem 0.4rem;
        }

        .objects-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
        }

        .objects-header h3 {
            position: static;
            transform: none;
            margin: 0;
            font-size: 1rem;
        }

        .header-controls {
            width: 100%;
            justify-content: space-between;
        }
    }
</style>

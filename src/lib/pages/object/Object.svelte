<script lang="ts">
    import { onMount } from 'svelte';

    import { getSelectedNetworkConfig } from '../../utils/client';
    import { queryDynamicFields, type DynamicFieldsResult } from '../../utils/dynamic-fields';
    import { getAddressLink, getObjectLink, getTransactionLink } from '../../utils/explorer-links';
    import { updatePageQueryParams, usePageQueryParams } from '../../utils/page-query-params';
    import { normalizeIotaAddress } from '../../utils/wasm-sdk';
    import { getIotaNamesPackageId } from '../iota-names/iota-names-config';
    import {
        detectInputType,
        fetchObjectsByTypeData,
        fetchPackageTypesData,
        fetchPackageVersionsData,
        fetchSingleObjectData,
    } from './objectUtils';

    // Query parameter integration
    const queryParamDefaults = {
        objectInput: '',
        pageSize: '5',
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

    // Package versions state
    let packageVersions = $state<{ address: string; version: number }[]>([]);
    let packageVersionsCursor = $state<string | null>(null);
    let packageVersionsHasNext = $state(false);
    let packageVersionsLoading = $state(false);
    let packageTypesPerVersion = $state<Map<string, any[]>>(new Map());
    let packageTypesLoadingMap = $state<Map<string, boolean>>(new Map());
    let expandedVersions = $state<Record<number, boolean>>({});

    // Dynamic fields state
    let dynamicFieldsMap = $state<Map<string, any[]>>(new Map());
    let dynamicFieldsLoading = $state<Map<string, boolean>>(new Map());
    let dynamicFieldsInitiallyOpen = $state<Map<string, boolean>>(new Map());

    async function fetchSingleObject(objectId: string) {
        try {
            loading = true;
            error = '';

            const config = getSelectedNetworkConfig();
            const obj = await fetchSingleObjectData(objectId, config.graphql);
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
            const objects = await fetchObjectsByTypeData(
                type,
                config.graphql,
                cursor,
                parseInt(pageSize),
            );
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

    async function fetchPackageVersions(packageId: string, cursor: string | null = null) {
        try {
            if (!cursor) {
                loading = true;
                packageVersions = [];
                packageTypesPerVersion = new Map();
                expandedVersions = {};
            } else {
                packageVersionsLoading = true;
            }
            error = '';

            const config = getSelectedNetworkConfig();
            const result = await fetchPackageVersionsData(packageId, config.graphql, cursor, 10);

            if (!result || !result.nodes || result.nodes.length === 0) {
                if (!cursor) {
                    // Not a package
                    throw new Error('Not a package');
                }
                return;
            }

            if (cursor) {
                // Append to existing list
                const startIndex = packageVersions.length;
                packageVersions = [...packageVersions, ...result.nodes];
                // Fetch types for the newly loaded versions and auto-expand those with new types
                await Promise.all(
                    result.nodes.map((v: { address: string }) => fetchTypesForVersion(v.address)),
                );
                for (let i = startIndex; i < packageVersions.length; i++) {
                    if (getNewTypesForVersion(i).length > 0) {
                        expandedVersions[i] = true;
                    }
                }
            } else {
                packageVersions = result.nodes;
            }

            packageVersionsCursor = result.pageInfo.endCursor;
            packageVersionsHasNext = result.pageInfo.hasNextPage;

            // Fetch types for all versions so we can determine which types are new per version
            if (!cursor && packageVersions.length > 0) {
                await Promise.all(packageVersions.map((v) => fetchTypesForVersion(v.address)));
                // Auto-expand versions that introduce new types
                for (let i = 0; i < packageVersions.length; i++) {
                    if (getNewTypesForVersion(i).length > 0) {
                        expandedVersions[i] = true;
                    }
                }
            }

            objectsList = [];
            mode = 'package';
        } finally {
            loading = false;
            packageVersionsLoading = false;
        }
    }

    async function fetchTypesForVersion(versionAddress: string) {
        if (packageTypesPerVersion.has(versionAddress)) return;

        packageTypesLoadingMap.set(versionAddress, true);
        packageTypesLoadingMap = new Map(packageTypesLoadingMap);

        try {
            const config = getSelectedNetworkConfig();
            const types = await fetchPackageTypesData(versionAddress, config.graphql);
            packageTypesPerVersion.set(versionAddress, types);
            packageTypesPerVersion = new Map(packageTypesPerVersion);
        } catch (e: any) {
            packageTypesPerVersion.set(versionAddress, []);
            packageTypesPerVersion = new Map(packageTypesPerVersion);
        } finally {
            packageTypesLoadingMap.set(versionAddress, false);
            packageTypesLoadingMap = new Map(packageTypesLoadingMap);
        }
    }

    async function loadMoreVersions() {
        if (!packageVersionsCursor || !packageVersionsHasNext) return;
        const input = objectInput.trim();
        await fetchPackageVersions(input, packageVersionsCursor);
    }

    async function toggleVersionExpand(index: number, versionAddress: string) {
        expandedVersions[index] = !expandedVersions[index];
        if (expandedVersions[index]) {
            // Fetch types for this version and all earlier versions (needed to determine new types)
            const fetchPromises = [];
            for (let j = 0; j <= index; j++) {
                fetchPromises.push(fetchTypesForVersion(packageVersions[j].address));
            }
            await Promise.all(fetchPromises);
        }
    }

    function isVersionTypesLoading(index: number): boolean {
        for (let j = 0; j <= index; j++) {
            if (packageTypesLoadingMap.get(packageVersions[j].address)) return true;
        }
        return false;
    }

    function isVersionTypesReady(index: number): boolean {
        for (let j = 0; j <= index; j++) {
            if (!packageTypesPerVersion.has(packageVersions[j].address)) return false;
        }
        return true;
    }

    function getNewTypesForVersion(index: number): any[] {
        const versionAddress = packageVersions[index].address;
        const types = packageTypesPerVersion.get(versionAddress) ?? [];

        // Collect all displayTypes from earlier versions
        const earlierTypes = new Set<string>();
        for (let j = 0; j < index; j++) {
            const prevTypes = packageTypesPerVersion.get(packageVersions[j].address) ?? [];
            prevTypes.forEach((t) => earlierTypes.add(t.displayType));
        }

        // Return only types not seen in earlier versions
        return types.filter((t) => !earlierTypes.has(t.displayType));
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
                // If it's a package (has asMovePackage), fetch package versions
                if (objectData && objectData.asMovePackage) {
                    await fetchPackageVersions(input);
                } else {
                    updatePageQueryParams({ objectInput: input });
                }
                return;
            } catch (e) {
                // Not an object, try as package
                await fetchPackageVersions(input);
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
            packageVersions = [];
            packageTypesPerVersion = new Map();
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
                    <button onclick={() => loadExample(getIotaNamesPackageId())}>
                        IOTA-Names
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

    {#if packageVersions.length > 0}
        <div class="package-types">
            <h3>Package Versions ({packageVersions.length}{packageVersionsHasNext ? '+' : ''})</h3>
            {#each packageVersions as ver, i}
                <div class="version-item">
                    <div class="version-header">
                        <button
                            class="version-toggle-btn"
                            onclick={() => toggleVersionExpand(i, ver.address)}
                        >
                            <span class="version-arrow">{expandedVersions[i] ? '▼' : '▶'}</span>
                            <strong>v{ver.version}</strong>
                            <code class="version-address">{ver.address}</code>
                        </button>
                        <button
                            onclick={() =>
                                window.open(
                                    getObjectLink(getSelectedNetworkConfig(), ver.address),
                                    '_blank',
                                )}
                            class="explorer-btn"
                        >
                            Explorer
                        </button>
                    </div>
                    {#if expandedVersions[i]}
                        <div class="version-types">
                            {#if isVersionTypesLoading(i)}
                                <div
                                    class="loading-message"
                                    style="padding: 0.5rem; margin: 0.25rem 0;"
                                >
                                    <div class="spinner"></div>
                                    <span>Loading types...</span>
                                </div>
                            {:else if isVersionTypesReady(i)}
                                {@const newTypes = getNewTypesForVersion(i)}
                                {#if newTypes.length > 0}
                                    <p class="types-hint">
                                        Click on a type to search for objects of that type:
                                    </p>
                                    <div class="types-list">
                                        {#each newTypes as type}
                                            <button
                                                class="type-btn"
                                                onclick={() => searchType(type.fullType)}
                                            >
                                                <code>{type.displayType}</code>
                                            </button>
                                        {/each}
                                    </div>
                                {:else}
                                    <p class="no-types">No new types in this version</p>
                                {/if}
                            {/if}
                        </div>
                    {/if}
                </div>
            {/each}
            {#if packageVersionsHasNext}
                <button
                    onclick={loadMoreVersions}
                    disabled={packageVersionsLoading}
                    class="load-more-btn"
                    style="margin-top: 0.5rem;"
                >
                    {packageVersionsLoading ? 'Loading...' : 'Load More Versions'}
                </button>
            {/if}
        </div>
    {/if}

    {#if objectData}
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
                        {#if objectData.asMovePackage}
                            {#if objectData.version || objectData.digest}
                                <div class="detail-row">
                                    {#if objectData.version}<strong>Version:</strong>
                                        <code>{objectData.version}</code>{/if}
                                    {#if objectData.digest}<strong>Digest:</strong>
                                        <code>{objectData.digest}</code>{/if}
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
                            <div class="detail-row">
                                <strong>Package</strong>
                            </div>
                            <div class="detail-row">
                                <strong>Modules:</strong>
                                <ul>
                                    {#each objectData.asMovePackage.modules.nodes as module}
                                        <li>{module.name}</li>
                                    {/each}
                                </ul>
                            </div>
                        {:else}
                            {#if objectData.version || objectData.digest}
                                <div class="detail-row">
                                    {#if objectData.version}<strong>Version:</strong>
                                        <code>{objectData.version}</code>{/if}
                                    {#if objectData.digest}<strong>Digest:</strong>
                                        <code>{objectData.digest}</code>{/if}
                                </div>
                            {/if}
                            {#if objectData.owner}
                                <div class="detail-row">
                                    <strong>Owner:</strong>
                                    <span>
                                        {#if objectData.owner.__typename === 'AddressOwner'}
                                            <span class="owner-type">Address</span>
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
                                        {:else if objectData.owner.__typename === 'Parent'}
                                            <span class="owner-type">Object</span>
                                            {#if objectData.owner.parent?.address}
                                                <a
                                                    href={getObjectLink(
                                                        getSelectedNetworkConfig(),
                                                        objectData.owner.parent.address,
                                                    )}
                                                    target="_blank"
                                                    class="address-link"
                                                >
                                                    {objectData.owner.parent.address}
                                                </a>
                                            {:else}
                                                (parent not accessible)
                                            {/if}
                                        {:else if objectData.owner.__typename === 'Shared'}
                                            <span class="owner-type">Shared</span>
                                            (v{objectData.owner.initialSharedVersion})
                                        {:else if objectData.owner.__typename === 'Immutable'}
                                            <span class="owner-type">Immutable</span>
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
                                        onclick={() =>
                                            queryDynamicFieldsForObject(objectData.address)}
                                        disabled={dynamicFieldsLoading.get(objectData.address) ||
                                            false}
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
                        {/if}
                    </div>
                </details>
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
                            <option value="5">5</option>
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
                            {#if obj.version || obj.digest}
                                <div class="detail-row">
                                    {#if obj.version}<strong>Version:</strong>
                                        <code>{obj.version}</code>{/if}
                                    {#if obj.digest}<strong>Digest:</strong>
                                        <code>{obj.digest}</code>{/if}
                                </div>
                            {/if}
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

    .owner-type {
        display: inline-block;
        padding: 1px 6px;
        border-radius: 4px;
        font-size: 0.65rem;
        font-weight: 600;
        text-transform: uppercase;
        background: rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.6);
        margin-right: 4px;
        vertical-align: middle;
    }

    .detail-row ul {
        text-align: left;
        margin: 0;
        padding-left: 1rem;
    }

    .detail-row li {
        text-align: left;
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

    .version-item {
        margin-bottom: 0.5rem;
        padding: 0.5rem;
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 4px;
    }

    .version-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .version-toggle-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: none;
        border: none;
        color: rgba(255, 255, 255, 0.9);
        cursor: pointer;
        padding: 0.25rem 0.5rem;
        font-size: 0.9rem;
        flex: 1;
        text-align: left;
    }

    .version-toggle-btn:hover {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 4px;
    }

    .version-arrow {
        color: rgba(59, 130, 246, 1);
        font-size: 0.8rem;
        font-weight: bold;
        width: 1rem;
        text-align: center;
        flex-shrink: 0;
    }

    .version-address {
        font-size: 0.8rem;
        color: rgba(255, 255, 255, 0.6);
    }

    .version-types {
        padding: 0.5rem 0 0 1.5rem;
    }

    .types-hint {
        color: rgba(255, 255, 255, 0.6);
        font-size: 0.85rem;
        margin: 0 0 0.5rem 0;
    }

    .types-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .no-types {
        color: rgba(255, 255, 255, 0.4);
        font-size: 0.85rem;
        font-style: italic;
        margin: 0;
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

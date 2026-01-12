<script lang="ts">
    import { IotaGraphQLClient } from '@iota/iota-sdk/graphql';

    import { getSelectedNetworkConfig } from '../lib/client';
    import {
        queryDynamicFields,
        type DynamicFieldsResult,
    } from '../lib/dynamic-fields/dynamic-fields-utils';
    import { getAddressLink, getObjectLink, getTransactionLink } from '../lib/explorer-links';

    interface Props {
        objectId: string;
        onClose?: () => void;
    }

    let { objectId, onClose }: Props = $props();

    let objectData = $state<any>(null);
    let error = $state('');
    let loading = $state(false);

    // Dynamic fields state
    let dynamicFields = $state<any[]>([]);
    let dynamicFieldsLoading = $state(false);
    let dynamicFieldsExpanded = $state(false);

    async function fetchObject(id: string) {
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
                        }
                    }
                `,
                variables: {
                    id,
                },
            });

            const obj = result.data?.object;
            if (!obj) {
                error = 'Object not found';
                objectData = null;
                return;
            }

            objectData = obj;
        } catch (e: any) {
            error = `Failed to fetch object: ${e.message || e}`;
            objectData = null;
        } finally {
            loading = false;
        }
    }

    async function queryDynamicFieldsForObject() {
        dynamicFieldsLoading = true;

        const result: DynamicFieldsResult = await queryDynamicFields({
            objectId,
            pageSize: 50,
            graphqlUrl: getSelectedNetworkConfig().graphql,
        });

        if (result.error) {
            console.error('Error fetching dynamic fields:', result.error);
            dynamicFields = [];
        } else {
            dynamicFields = result.nodes;
            dynamicFieldsExpanded = true;
        }

        dynamicFieldsLoading = false;
    }

    $effect(() => {
        if (objectId) {
            fetchObject(objectId);
        }
    });
</script>

<div class="object-view-container">
    {#if onClose}
        <div class="object-view-header">
            <button class="close-btn" onclick={onClose}>×</button>
        </div>
    {/if}

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

    {#if objectData}
        <div class="object-content">
            <div class="detail-row">
                <strong>Address:</strong>
                <code class="object-address">{objectData.address}</code>
                <a
                    href={getObjectLink(getSelectedNetworkConfig(), objectData.address)}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="explorer-link"
                >
                    Explorer ↗
                </a>
            </div>

            {#if objectData.owner}
                <div class="detail-row">
                    <strong>Owner:</strong>
                    <span>
                        {#if objectData.owner.owner}
                            <a
                                href={getAddressLink(
                                    getSelectedNetworkConfig(),
                                    objectData.owner.owner.address || objectData.owner.owner,
                                )}
                                target="_blank"
                                class="address-link"
                            >
                                {objectData.owner.owner.address || objectData.owner.owner}
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
                <div class="detail-row">
                    <strong>Type:</strong>
                    <code>{objectData.asMoveObject.contents.type?.repr || 'Unknown'}</code>
                </div>

                <div class="detail-row">
                    <strong>Contents:</strong>
                    <button
                        onclick={queryDynamicFieldsForObject}
                        disabled={dynamicFieldsLoading}
                        class="dynamic-fields-btn"
                    >
                        {dynamicFieldsLoading
                            ? 'Loading...'
                            : dynamicFields.length > 0
                              ? `Dynamic Fields: ${dynamicFields.length}`
                              : 'Query Dynamic Fields'}
                    </button>
                </div>

                <pre class="json-content">{JSON.stringify(
                        objectData.asMoveObject.contents.json,
                        null,
                        2,
                    )}</pre>

                {#if dynamicFields.length > 0}
                    <details class="dynamic-fields-details" open={dynamicFieldsExpanded}>
                        <summary class="dynamic-fields-summary">
                            <strong>Dynamic Fields ({dynamicFields.length})</strong>
                        </summary>
                        <pre class="json-content">{JSON.stringify(dynamicFields, null, 2)}</pre>
                    </details>
                {/if}
            {/if}
        </div>
    {/if}
</div>

<style>
    .object-view-container {
        background: var(--background-card);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        max-width: 800px;
        max-height: 80vh;
        overflow-y: auto;
    }

    .object-view-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem 1rem;
        background: var(--background-light);
        border-bottom: 1px solid var(--border-color);
        position: sticky;
        top: 0;
        z-index: 1;
    }

    .close-btn {
        background: #911a26;
        color: white;
        border: none;
        border-radius: 4px;
        width: 1.6rem;
        height: 1.6rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1rem;
        cursor: pointer;
        transition: background 0.2s;
    }

    .close-btn:hover {
        background: #6e0e18;
    }

    .object-content {
        padding: 1rem;
    }

    .detail-row {
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
        align-items: baseline;
        flex-wrap: wrap;
    }

    .detail-row strong {
        color: rgba(255, 255, 255, 0.9);
        font-weight: 600;
        font-size: 0.8rem;
        flex-shrink: 0;
    }

    .detail-row span {
        color: rgba(255, 255, 255, 0.7);
        font-size: 0.8rem;
        word-break: break-all;
    }

    .object-address {
        font-size: 0.8rem;
        color: rgba(255, 255, 255, 0.9);
        word-break: break-all;
    }

    .explorer-link {
        font-size: 0.75rem;
        color: rgba(59, 130, 246, 1);
        text-decoration: none;
        padding: 0.2rem 0.4rem;
        border-radius: 3px;
        background: rgba(59, 130, 246, 0.1);
    }

    .explorer-link:hover {
        background: rgba(59, 130, 246, 0.2);
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

    code {
        background: rgba(0, 0, 0, 0.3);
        padding: 0.2rem 0.4rem;
        border-radius: 3px;
        font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
        font-size: 0.8rem;
        color: rgba(255, 255, 255, 0.9);
        word-break: break-all;
    }

    .json-content {
        background: rgba(0, 0, 0, 0.3);
        padding: 0.5rem;
        border-radius: 4px;
        font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
        font-size: 0.7rem;
        color: rgba(255, 255, 255, 0.9);
        overflow-x: auto;
        white-space: pre;
        text-align: left;
        margin-top: 0.25rem;
        max-height: 200px;
        overflow-y: auto;
    }

    .dynamic-fields-btn {
        padding: 0.25rem 0.5rem;
        background-color: rgb(36, 47, 77);
        color: #ffffff;
        border: 1px solid #535353;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.8rem;
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

    .dynamic-fields-details {
        margin-top: 0.75rem;
    }

    .dynamic-fields-summary {
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 4px;
        user-select: none;
    }

    .dynamic-fields-summary::-webkit-details-marker {
        display: none;
    }

    .dynamic-fields-summary::before {
        content: '▶';
        color: rgba(59, 130, 246, 1);
        font-size: 0.8rem;
        transition: transform 0.2s ease;
    }

    .dynamic-fields-details[open] .dynamic-fields-summary::before {
        content: '▼';
    }

    .error-message {
        padding: 0.75rem;
        margin: 1rem;
        background: rgba(220, 38, 38, 0.1);
        border: 1px solid rgba(220, 38, 38, 0.3);
        border-radius: 6px;
        color: #fca5a5;
    }

    .loading-message {
        padding: 1rem;
        margin: 1rem;
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
</style>

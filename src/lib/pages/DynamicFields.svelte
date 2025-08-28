<script lang="ts">
    import { toB64 } from '@iota/iota-sdk/utils';
    import { untrack } from 'svelte';
    import { writable } from 'svelte/store';

    import JsonToggleView from '../components/JsonToggleView.svelte';
    import { decodeBcs, layoutToBcs, type BcsDecodeResult } from '../lib/dynamic-fields/bcs-conversion';
    import {
        deriveDynamicFieldId,
        deriveDynamicFieldIdWithBcs,
        enhanceFieldsWithLayoutsAndBcs,
        getMoveLayout,
        queryDynamicField,
        queryDynamicFields,
        queryDynamicObjectField,
        type DynamicFieldsResult,
        type LayoutResult,
    } from '../lib/dynamic-fields/dynamic-fields-utils';
    import {
        defaultStructDefinitions,
        type StructDefinition,
    } from '../lib/dynamic-fields/struct-definitions';
    import { getSelectedNetworkConfig } from '../lib/client';

    let objectId = $state('0x35af1c0c5d8ee4878b2686a35639eba6a830c8a99e2e126df560265122bd6c9c');
    let dynamicFields: any = $state(null);
    let error: string = $state('');
    let loading = $state(false);
    let endCursor: string | null = null;
    let hasNextPage: boolean = $state(false);
    let pageSize: number = $state(10);

    let fieldType: string = $state('bool');
    let fieldBcs: string = $state('AA==');
    let dynamicFieldResult: any = $state(null);
    let dynamicObjectFieldResult: any = $state(null);
    let fieldError: string = $state('');
    let fieldLoading: boolean = $state(false);
    let computedDynamicFieldId: string = $state('');

    let bcsInputMode: 'base64' | 'json' = $state('json');
    let fieldStructType: string = $state('Bool');

    let structDefinitions: StructDefinition[] = $state([...defaultStructDefinitions]);

    let selectedStructJson = $state('');
    let structsError = $state('');
    let isUpdatingFromSelection = false;

    // Initialize on load
    $effect(() => {
        if (!selectedStructJson) {
            updateSelectedStructJson();
        }
    });

    // Initialize the selected struct JSON
    function updateSelectedStructJson() {
        if (isUpdatingFromSelection) return;
        const selected = getSelectedStruct();
        if (selected) {
            isUpdatingFromSelection = true;
            try {
                // Try to parse the value as JSON, fall back to treating it as a string
                let valueObj;
                try {
                    valueObj = JSON.parse(selected.value);
                } catch {
                    // If parsing fails, treat as a string (shouldn't happen with our data structure)
                    valueObj = selected.value;
                }

                selectedStructJson = JSON.stringify(
                    {
                        name: selected.name,
                        fieldType: selected.fieldType,
                        layout: selected.layout,
                        value: valueObj,
                    },
                    null,
                    2,
                );
            } catch (e) {
                console.error('Error updating selected struct JSON:', e);
                selectedStructJson = JSON.stringify(
                    {
                        name: selected.name,
                        fieldType: selected.fieldType,
                        layout: {},
                        value: {},
                    },
                    null,
                    2,
                );
            }
            isUpdatingFromSelection = false;
        }
    }

    // Update when selection changes
    $effect(() => {
        fieldStructType; // Track the dependency
        updateSelectedStructJson();
    });

    // Update fieldType when struct selection changes
    $effect(() => {
        const selected = getSelectedStruct();
        if (selected && selected.fieldType) {
            fieldType = selected.fieldType;
        }
    });

    function getBcsBase64(): string {
        if (bcsInputMode === 'base64') {
            return fieldBcs;
        }
        try {
            const struct = getSelectedStruct();
            if (!struct) throw new Error('Unknown struct type');
            const json = JSON.parse(struct.value);

            // Convert the JSON layout to BCS schema using layoutToBcs
            const bcsSchema = layoutToBcs(struct.layout);
            return toB64(bcsSchema.serialize(json).toBytes());
        } catch (e) {
            fieldError = 'BCS serialization error: ' + e;
            return '';
        }
    }

    function computeDynamicFieldId(): string {
        if (!objectId || !fieldType) {
            return '';
        }

        try {
            if (bcsInputMode === 'base64') {
                if (!fieldBcs.trim()) return '';
                return deriveDynamicFieldIdWithBcs(objectId, fieldType, fieldBcs);
            } else {
                const struct = getSelectedStruct();
                if (!struct) return '';
                const json = JSON.parse(struct.value);

                // Convert the JSON layout to BCS schema using layoutToBcs
                const bcsSchema = layoutToBcs(struct.layout);
                return deriveDynamicFieldId(objectId, fieldType, bcsSchema, json);
            }
        } catch (e) {
            console.error('Error computing dynamic field ID:', e);
            return '';
        }
    }

    // Update computed dynamic field ID when relevant values change
    $effect(() => {
        // Track dependencies
        objectId;
        fieldType;
        fieldBcs;
        fieldStructType;
        bcsInputMode;
        computedDynamicFieldId = computeDynamicFieldId();
    });

    async function handleQueryDynamicFields(cursor?: string) {
        error = '';
        if (!cursor) {
            dynamicFields = [];
            endCursor = null;
        }
        loading = true;

        const result: DynamicFieldsResult = await queryDynamicFields({
            objectId,
            pageSize,
            cursor,
            graphqlUrl: getSelectedNetworkConfig().graphql,
        });

        if (result.error) {
            error = result.error;
        } else {
            if (cursor) {
                dynamicFields = [...dynamicFields, ...result.nodes];
            } else {
                dynamicFields = result.nodes;
                // If we have elements and this is the first query (not pagination),
                // update fieldType with the first element's type repr
                if (result.nodes.length > 0 && result.nodes[0]?.name?.type?.repr) {
                    fieldType = result.nodes[0].name.type.repr;
                }
            }
            hasNextPage = result.hasNextPage;
            endCursor = result.endCursor;
        }

        loading = false;
    }

    function loadMore() {
        if (hasNextPage && endCursor) {
            handleQueryDynamicFields(endCursor);
        }
    }

    async function handleGetLayoutsAndBcsValues() {
        if (!dynamicFields || dynamicFields.length === 0) return;

        loading = true;
        error = '';

        try {
            const updatedFields = await enhanceFieldsWithLayoutsAndBcs(
                dynamicFields,
                getSelectedNetworkConfig().graphql,
            );
            dynamicFields = updatedFields;
        } catch (e: any) {
            error = `Error processing layouts: ${e.message || String(e)}`;
        }

        loading = false;
    }

    async function handleQueryDynamicField() {
        fieldError = '';
        dynamicFieldResult = null;
        fieldLoading = true;

        const bcsValue = getBcsBase64();
        if (!bcsValue) {
            fieldLoading = false;
            return;
        }

        const result = await queryDynamicField({
            objectId,
            fieldType,
            bcsValue,
            graphqlUrl: getSelectedNetworkConfig().graphql,
        });

        if (result.error) {
            fieldError = result.error;
            dynamicFieldResult = null;
        } else {
            dynamicFieldResult = result.field;
        }

        fieldLoading = false;
    }

    async function handleQueryDynamicObjectField() {
        fieldError = '';
        dynamicObjectFieldResult = null;
        fieldLoading = true;

        const bcsValue = getBcsBase64();
        if (!bcsValue) {
            fieldLoading = false;
            return;
        }

        const result = await queryDynamicObjectField({
            objectId,
            fieldType,
            bcsValue,
            graphqlUrl: getSelectedNetworkConfig().graphql,
        });

        if (result.error) {
            fieldError = result.error;
            dynamicObjectFieldResult = null;
        } else {
            dynamicObjectFieldResult = result.field;
        }

        fieldLoading = false;
    }

    let customStructs = writable<Record<string, any>>({});

    // Add state for layout query
    let layoutType = $state('0x2::vec_set::VecSet<u64>');
    let layoutResult: any = $state(null);
    let layoutError = $state('');
    let layoutLoading = $state(false);

    let decodedFieldValue: any = $state(null);
    let decodeError: string = $state('');
    let isDecodingInProgress = $state(false);

    // Initialize on load
    $effect(() => {
        if (!selectedStructJson) {
            updateSelectedStructJson();
        }
    });

    async function handleGetMoveLayout() {
        layoutError = '';
        layoutResult = null;
        layoutLoading = true;

        const result: LayoutResult = await getMoveLayout(
            layoutType,
            getSelectedNetworkConfig().graphql,
        );

        if (result.error) {
            layoutError = result.error;
            layoutResult = null;
        } else {
            layoutResult = { layout: result.layout };
        }

        layoutLoading = false;
    }

    function updateStructFromJson() {
        if (!selectedStructJson.trim() || isUpdatingFromSelection) return;

        untrack(() => {
            try {
                const parsed = JSON.parse(selectedStructJson);
                if (parsed && parsed.name && parsed.value !== undefined) {
                    // Update the selected struct in the definitions array
                    const index = structDefinitions.findIndex((s) => s.name === parsed.name);
                    if (index >= 0) {
                        // Update existing struct - convert value back to JSON string
                        structDefinitions[index] = {
                            ...structDefinitions[index],
                            fieldType: parsed.fieldType || structDefinitions[index].fieldType,
                            layout: parsed.layout || structDefinitions[index].layout,
                            value:
                                typeof parsed.value === 'string'
                                    ? parsed.value
                                    : JSON.stringify(parsed.value),
                        };
                    } else {
                        // Add new struct if it doesn't exist
                        structDefinitions.push({
                            name: parsed.name,
                            fieldType: parsed.fieldType || '',
                            layout: parsed.layout || { struct: { type: parsed.name, fields: [] } },
                            value:
                                typeof parsed.value === 'string'
                                    ? parsed.value
                                    : JSON.stringify(parsed.value),
                        });
                    }
                    structsError = '';
                } else {
                    structsError = 'Struct definition must have name and value properties';
                }
            } catch (e) {
                structsError = 'Invalid JSON in struct definition';
            }
        });
    }

    function getSelectedStruct(): StructDefinition | null {
        return structDefinitions.find((s) => s.name === fieldStructType) || null;
    }

    function addNewStruct() {
        const newName = prompt('Enter new struct name:');
        if (newName && !structDefinitions.find((s) => s.name === newName)) {
            structDefinitions.push({
                name: newName,
                fieldType: '',
                layout: { struct: { type: newName, fields: [] } },
                value: '{}',
            });
            fieldStructType = newName;
            updateSelectedStructJson();
        }
    }

    // Add reactive effect with debounce to decode when fieldBcs or fieldType changes
    let decodeTimeout: any;
    $effect(() => {
        if (fieldBcs && fieldType && !layoutLoading) {
            clearTimeout(decodeTimeout);
            decodeTimeout = setTimeout(() => {
                decodeFieldBcs();
            }, 300); // 300ms debounce
        }
    });

    async function decodeFieldBcs() {
        if (isDecodingInProgress) return;

        isDecodingInProgress = true;
        decodedFieldValue = null;
        decodeError = '';

        if (!fieldBcs.trim() || !fieldType.trim()) {
            isDecodingInProgress = false;
            return;
        }

        try {
            let currentLayout = layoutResult?.layout;

            // If no layout available, automatically fetch it
            if (!currentLayout) {
                const result = await getMoveLayout(fieldType, getSelectedNetworkConfig().graphql);

                if (result.error) {
                    decodeError = `Failed to fetch layout: ${result.error}`;
                    isDecodingInProgress = false;
                    return;
                }

                if (!result.layout) {
                    decodeError = 'Layout not found for this type.';
                    isDecodingInProgress = false;
                    return;
                }

                currentLayout = result.layout;
            }

            const decodeResult: BcsDecodeResult = decodeBcs(fieldBcs, currentLayout);

            if (decodeResult.error) {
                decodeError = `Decode error: ${decodeResult.error}`;
            } else {
                decodedFieldValue = decodeResult.value;
            }
        } catch (e: any) {
            decodeError = `Decode error: ${e.message || String(e)}`;
        } finally {
            isDecodingInProgress = false;
        }
    }
</script>

<main>
    <h2>Dynamic Fields</h2>
    <div>
        <label>
            Object ID:
            <input bind:value={objectId} placeholder="0x..." size="67" />
        </label>
        <br />
        <label style="margin-left:1em;">
            Page size:
            <input type="number" min="1" max="100" bind:value={pageSize} style="width:6rem;" />
        </label>
        <button onclick={() => handleQueryDynamicFields()} disabled={loading || !objectId}>
            {loading ? 'Loading...' : 'Query Dynamic Fields'}
        </button>
        <button
            onclick={handleGetLayoutsAndBcsValues}
            disabled={loading || !dynamicFields || dynamicFields.length === 0}
            style="margin-left:1em;"
        >
            Get Layouts and BCS Values
        </button>
    </div>
    {#if error}
        <div style="color: red; margin-top: 1em;">{error}</div>
    {/if}
    {#if dynamicFields}
        {#if dynamicFields.length === 0 && !loading}
            <div>No dynamic fields found for this object.</div>
        {:else}
            <JsonToggleView value={dynamicFields} />
            {#if hasNextPage}
                <button onclick={loadMore} disabled={loading} style="margin-top:1em;"
                    >{loading ? 'Loading...' : 'Load more'}</button
                >
            {/if}
        {/if}
    {/if}
    <hr style="margin:2em 0;" />
    <h3>Query Dynamic Field / Dynamic Object Field</h3>
    <div style="margin-bottom:1em;">
        <label>
            Field type (primitive or name.type.repr, like
            &lt;package&gt;::&lt;module&gt;::&lt;struct&gt;):
            <input
                bind:value={fieldType}
                placeholder="e.g. 0x1::string::String"
                style="width: 100%"
            />
        </label>
        <br />
        <button
            onclick={() => {
                layoutType = fieldType;
                handleGetMoveLayout();
            }}
            disabled={layoutLoading || !fieldType}
            style="margin-top:0.5em; margin-bottom:1em;"
        >
            {layoutLoading ? 'Loading...' : 'Get Layout for this type'}
        </button>
        <br />
        {#if layoutResult}
            <JsonToggleView value={layoutResult} />
        {/if}
        <br />
        Field value (default is for structs without fields):
        <div>
            <button
                type="button"
                onclick={() => {
                    bcsInputMode = bcsInputMode === 'base64' ? 'json' : 'base64';
                }}
                style="margin-right:0.5em; display: inline-block;"
            >
                {bcsInputMode === 'base64' ? 'Switch to JSON' : 'Switch to Base64'}
            </button>
        </div>
        {#if bcsInputMode === 'base64'}
            Field BCS (Base64):
            <input bind:value={fieldBcs} placeholder="Base64 BCS" size="32" />
            {#if fieldBcs.trim()}
                <div style="margin-top: 0.5em;">
                    <button onclick={decodeFieldBcs} style="padding: 2px 8px; font-size: 0.9em;">
                        Decode BCS
                    </button>
                </div>
                {#if decodeError}
                    <div style="color: red; margin-top: 0.5em; font-size: 0.9em;">
                        {decodeError}
                    </div>
                {/if}
                {#if decodedFieldValue !== null}
                    <div style="margin-top: 0.5em;">
                        <strong>Decoded value:</strong>
                        {#if typeof decodedFieldValue === 'object' && decodedFieldValue !== null}
                            <JsonToggleView value={decodedFieldValue} />
                        {:else}
                            <span
                                style="font-family: monospace; padding: 2px 4px; border-radius: 2px;"
                            >
                                {decodedFieldValue}
                            </span>
                            <span style="color: #666; font-size: 0.9em; margin-left: 0.5em;">
                                ({typeof decodedFieldValue})
                            </span>
                        {/if}
                    </div>
                {/if}
            {/if}
        {:else}
            Struct type: Examples apart from Domain are from this package:
            <a
                target="_blank"
                rel="noopener noreferrer"
                style="color: #007bff; text-decoration: none;"
                href="https://github.com/Thoralf-M/iota-examples/tree/main/move/dynamic_fields"
                >https://github.com/Thoralf-M/iota-examples/tree/main/move/dynamic_fields</a
            >
            <br />
            In devnet:
            <a
                target="_blank"
                rel="noopener noreferrer"
                style="color: #007bff; text-decoration: none;"
                href="https://explorer.iota.org/object/0x25ee69608c70f9d614790e8a46aa32c18798c4fa9cfc20e5dd0ec1f7505bd5ef?module=dynamic_fields&network=devnet"
                >0x25ee69608c70f9d614790e8a46aa32c18798c4fa9cfc20e5dd0ec1f7505bd5ef</a
            >
            <br />

            <select
                bind:value={fieldStructType}
                style="margin-right:0.5em;"
                onchange={updateSelectedStructJson}
            >
                {#each structDefinitions as structDef}
                    <option value={structDef.name}>{structDef.name}</option>
                {/each}
                {#each Object.keys($customStructs || {}) as structType}
                    <option value={structType}>{structType}</option>
                {/each}
            </select>
            <button
                type="button"
                onclick={addNewStruct}
                style="margin-left:0.5em; padding:2px 8px; font-size:0.9em;">+ Add New</button
            >
            <div style="margin-top:1em;">
                <h4 style="margin-bottom:0.5em;">Selected Struct Definition</h4>
                <p style="font-size:0.9em; color:#666;">
                    Edit the selected struct. Object should have: name, fieldType, layout (JSON),
                    and value (JSON). The layout defines the structure of the data and will be
                    converted to BCS for serialization.
                </p>
                {#if structsError}
                    <div style="color: red; margin-bottom: 0.5em;">{structsError}</div>
                {/if}
                <textarea
                    bind:value={selectedStructJson}
                    oninput={updateStructFromJson}
                    rows="12"
                    cols="130"
                    style="font-family: monospace;"
                ></textarea>
            </div>
            {#if fieldStructType}
                {@const bcsValue = getBcsBase64()}
                {#if bcsValue}
                    <div
                        style="margin-top: 0.5em; padding: 0.5em; border-radius: 4px; font-family: monospace; word-break: break-all;"
                    >
                        <strong>Computed BCS Base64 encoded:</strong>
                        {bcsValue}
                        <button
                            onclick={() => navigator.clipboard.writeText(bcsValue)}
                            style="margin-left: 0.5em; padding: 2px 6px; font-size: 0.8em; cursor: pointer;"
                            title="Copy to clipboard"
                        >
                            📋 Copy
                        </button>
                    </div>
                {:else}
                    <div style="margin-top: 0.5em; color: #999; font-style: italic;">
                        Unable to compute BCS value - check struct definition and value
                    </div>
                {/if}
            {:else}
                <div style="margin-top: 0.5em; color: #999; font-style: italic;">
                    Select a struct type to see computed BCS value
                </div>
            {/if}
        {/if}
        {#if computedDynamicFieldId}
            <div
                style="margin-top: 0.5em; padding: 0.5em; border-radius: 4px; font-family: monospace; word-break: break-all;"
            >
                <strong>Computed Dynamic Field ID:</strong>
                {computedDynamicFieldId}
                <button
                    onclick={() => navigator.clipboard.writeText(computedDynamicFieldId)}
                    style="margin-left: 0.5em; padding: 2px 6px; font-size: 0.8em; cursor: pointer;"
                    title="Copy to clipboard"
                >
                    📋 Copy
                </button>
            </div>
        {:else if objectId && fieldType && (bcsInputMode === 'base64' ? fieldBcs : fieldStructType)}
            <div style="margin-top: 0.5em; color: #666; font-style: italic;">Computing...</div>
        {:else}
            <div style="margin-top: 0.5em; color: #999; font-style: italic;">
                Enter object ID, field type, and field value to compute dynamic field ID
            </div>
        {/if}
    </div>
    <div style="margin-bottom:1em;">
        <button
            onclick={handleQueryDynamicField}
            disabled={fieldLoading ||
                !objectId ||
                !fieldType ||
                (bcsInputMode === 'base64' ? !fieldBcs : !fieldStructType || getBcsBase64() === '')}
        >
            {fieldLoading ? 'Loading...' : 'Query dynamicField'}
        </button>
        <button
            onclick={handleQueryDynamicObjectField}
            disabled={fieldLoading ||
                !objectId ||
                !fieldType ||
                (bcsInputMode === 'base64' ? !fieldBcs : !fieldStructType || getBcsBase64() === '')}
            style="margin-left:1em;"
        >
            {fieldLoading ? 'Loading...' : 'Query dynamicObjectField'}
        </button>
    </div>
    {#if fieldError}
        <div style="color: red; margin-top: 1em;">{fieldError}</div>
    {/if}
    {#if dynamicFieldResult}
        <h4>dynamicField Result</h4>
        <JsonToggleView value={dynamicFieldResult} />
    {/if}
    {#if dynamicObjectFieldResult}
        <h4>dynamicObjectField Result</h4>
        <JsonToggleView value={dynamicObjectFieldResult} />
    {/if}
    {#if layoutError}
        <div style="color: red; margin-top: 1em;">{layoutError}</div>
    {/if}
</main>

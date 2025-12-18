<script lang="ts">
    import { IotaGraphQLClient } from '@iota/iota-sdk/graphql';
    import { onMount } from 'svelte';
    import * as d3 from 'd3';

    import ObjectView from '../components/ObjectView.svelte';
    import TransactionView from '../components/TransactionView.svelte';
    import { getClient, getSelectedNetworkConfig } from '../lib/client';
    import { GraphQLDataFetcher } from '../lib/epoch-ptb-analyzer/graphql-fetcher';
    import { getAddressLink, getObjectLink, getTransactionLink } from '../lib/explorer-links';
    import { updatePageQueryParams, usePageQueryParams } from '../lib/page-query-params';

    // Query parameter integration
    const queryParamDefaults = {
        txIds: '',
        objectIds: '',
        addresses: '',
        fetchSize: '5',
        afterCheckpoint: '',
        beforeCheckpoint: '',
        substringFilter: '',
    };

    const pageParams = usePageQueryParams(queryParamDefaults);

    // Input fields
    let txIdsInput = $state('');
    let objectIdsInput = $state('');
    let addressesInput = $state('');
    let fetchSize = $state('5');
    let afterCheckpoint = $state('');
    let beforeCheckpoint = $state('');

    // State
    let loading = $state(false);
    let error = $state('');

    // Tracked addresses with enable/disable state and tx count
    let trackedAddresses = $state<Map<string, { enabled: boolean; label: string; txCount: number }>>(new Map());

    // Filter state
    let filterByObjectId = $state<string | null>(null);
    let filterByAddress = $state<string | null>(null);
    let substringFilter = $state('');

    // Expand/collapse all state
    let allExpanded = $state(false);
    let expandedTransactions = $state<Set<string>>(new Set());

    // View mode: 'list' or 'graph'
    let viewMode = $state<'list' | 'graph'>('list');

    // Graph elements
    let graphContainer = $state<HTMLDivElement>();
    let svgElement = $state<SVGSVGElement>();

    // Transaction data
    interface CreatedObject {
        objectId: string;
        objectType: string;
        version: string;
    }

    interface InputObject {
        objectId: string;
        objectType: string;
        version: string;
        isGas?: boolean;
    }

    interface MutatedObject {
        objectId: string;
        objectType: string;
        previousVersion: string;
        version: string;
    }

    interface TransactionNode {
        digest: string;
        sender: string;
        checkpoint: number;
        timestamp: string;
        createdObjects: CreatedObject[];
        mutatedObjects: MutatedObject[];
        deletedObjects: string[];
        inputObjects: InputObject[];
        recipients: string[]; // Addresses that received objects
        rawData?: any; // Store raw tx data for substring search
    }

    let transactions = $state<Map<string, TransactionNode>>(new Map());

    // Object to transaction mapping (which transactions use/create each object)
    let objectTransactionMap = $state<Map<string, { created?: string; used: string[]; type?: string }>>(new Map());

    // Popup state
    let selectedTransaction = $state<any>(null);
    let selectedObjectId = $state<string | null>(null);
    let showTransactionPopup = $state(false);
    let showObjectPopup = $state(false);

    // Hover state for highlighting
    let hoveredObjectId = $state<string | null>(null);

    // Expanded objects inline (not popup) - uses composite key "txDigest:objectId"
    let expandedCreatedObjects = $state<Set<string>>(new Set());
    let expandedInputObjects = $state<Set<string>>(new Set());
    let expandedMutatedObjects = $state<Set<string>>(new Set());

    function makeExpandKey(txDigest: string, objectId: string): string {
        return `${txDigest}:${objectId}`;
    }

    function toggleExpandMutated(txDigest: string, objectId: string) {
        const key = makeExpandKey(txDigest, objectId);
        if (expandedMutatedObjects.has(key)) {
            expandedMutatedObjects.delete(key);
        } else {
            expandedMutatedObjects.add(key);
        }
        expandedMutatedObjects = new Set(expandedMutatedObjects);
    }

    function toggleExpandCreated(txDigest: string, objectId: string) {
        const key = makeExpandKey(txDigest, objectId);
        if (expandedCreatedObjects.has(key)) {
            expandedCreatedObjects.delete(key);
        } else {
            expandedCreatedObjects.add(key);
        }
        expandedCreatedObjects = new Set(expandedCreatedObjects);
    }

    function toggleExpandInput(txDigest: string, objectId: string) {
        const key = makeExpandKey(txDigest, objectId);
        if (expandedInputObjects.has(key)) {
            expandedInputObjects.delete(key);
        } else {
            expandedInputObjects.add(key);
        }
        expandedInputObjects = new Set(expandedInputObjects);
    }

    // Toggle all objects in a section expanded/collapsed
    function toggleAllInSection(tx: TransactionNode, section: 'inputs' | 'created' | 'mutated') {
        if (section === 'inputs') {
            const allExpanded = tx.inputObjects.every((o) => expandedInputObjects.has(makeExpandKey(tx.digest, o.objectId)));
            if (allExpanded) {
                // Collapse all
                for (const obj of tx.inputObjects) {
                    expandedInputObjects.delete(makeExpandKey(tx.digest, obj.objectId));
                }
            } else {
                // Expand all
                for (const obj of tx.inputObjects) {
                    expandedInputObjects.add(makeExpandKey(tx.digest, obj.objectId));
                }
            }
            expandedInputObjects = new Set(expandedInputObjects);
        } else if (section === 'created') {
            const allExpanded = tx.createdObjects.every((o) => expandedCreatedObjects.has(makeExpandKey(tx.digest, o.objectId)));
            if (allExpanded) {
                for (const obj of tx.createdObjects) {
                    expandedCreatedObjects.delete(makeExpandKey(tx.digest, obj.objectId));
                }
            } else {
                for (const obj of tx.createdObjects) {
                    expandedCreatedObjects.add(makeExpandKey(tx.digest, obj.objectId));
                }
            }
            expandedCreatedObjects = new Set(expandedCreatedObjects);
        } else if (section === 'mutated') {
            const allExpanded = tx.mutatedObjects.every((o) => expandedMutatedObjects.has(makeExpandKey(tx.digest, o.objectId)));
            if (allExpanded) {
                for (const obj of tx.mutatedObjects) {
                    expandedMutatedObjects.delete(makeExpandKey(tx.digest, obj.objectId));
                }
            } else {
                for (const obj of tx.mutatedObjects) {
                    expandedMutatedObjects.add(makeExpandKey(tx.digest, obj.objectId));
                }
            }
            expandedMutatedObjects = new Set(expandedMutatedObjects);
        }
    }

    function areAllInSectionExpanded(tx: TransactionNode, section: 'inputs' | 'created' | 'mutated'): boolean {
        if (section === 'inputs') {
            return tx.inputObjects.length > 0 && tx.inputObjects.every((o) => expandedInputObjects.has(makeExpandKey(tx.digest, o.objectId)));
        } else if (section === 'created') {
            return tx.createdObjects.length > 0 && tx.createdObjects.every((o) => expandedCreatedObjects.has(makeExpandKey(tx.digest, o.objectId)));
        } else if (section === 'mutated') {
            return tx.mutatedObjects.length > 0 && tx.mutatedObjects.every((o) => expandedMutatedObjects.has(makeExpandKey(tx.digest, o.objectId)));
        }
        return false;
    }

    // Cursor tracking for pagination
    let addressCursors = $state<Map<string, string | null>>(new Map());

    function parseInputList(input: string): string[] {
        return input
            .split(/[\n,;]+/)
            .map((s) => s.trim())
            .filter((s) => s.length > 0);
    }

    async function fetchTransactionByDigest(digest: string): Promise<TransactionNode | null> {
        try {
            const client = getClient();
            const tx = await client.getTransactionBlock({
                digest,
                options: {
                    showInput: true,
                    showRawInput: true,
                    showEffects: true,
                    showObjectChanges: true,
                },
            });

            if (!tx) return null;

            const checkpoint = tx.checkpoint ? parseInt(tx.checkpoint) : 0;
            const timestamp = tx.timestampMs || '';
            const sender = tx.transaction?.data?.sender || '';

            // Extract created objects
            const createdObjects: CreatedObject[] = [];
            const mutatedObjects: MutatedObject[] = [];
            const deletedObjects: string[] = [];
            const inputObjects: InputObject[] = [];
            const recipients: string[] = [];

            // Build a map of object types from objectChanges
            const objectTypeMap = new Map<string, string>();
            if (tx.objectChanges) {
                for (const change of tx.objectChanges) {
                    if ('objectId' in change && 'objectType' in change) {
                        objectTypeMap.set(change.objectId, change.objectType || 'Unknown');
                    }
                    if (change.type === 'created') {
                        createdObjects.push({
                            objectId: change.objectId,
                            objectType: change.objectType || 'Unknown',
                            version: change.version || '',
                        });
                        // Track recipient if different from sender
                        if ('owner' in change && typeof change.owner === 'object') {
                            const owner = change.owner as any;
                            if (owner.AddressOwner && owner.AddressOwner !== sender) {
                                recipients.push(owner.AddressOwner);
                            }
                        }
                    } else if (change.type === 'mutated') {
                        mutatedObjects.push({
                            objectId: change.objectId,
                            objectType: change.objectType || 'Unknown',
                            previousVersion: change.previousVersion || '',
                            version: change.version || '',
                        });
                        // Track recipient if ownership changed
                        if ('owner' in change && typeof change.owner === 'object') {
                            const owner = change.owner as any;
                            if (owner.AddressOwner && owner.AddressOwner !== sender) {
                                recipients.push(owner.AddressOwner);
                            }
                        }
                    } else if (change.type === 'deleted') {
                        deletedObjects.push(change.objectId);
                    }
                }
            }

            // Extract input objects from transaction data
            if (tx.transaction?.data?.transaction) {
                const txData = tx.transaction.data.transaction as any;
                if (txData.inputs) {
                    for (const input of txData.inputs) {
                        if (input.type === 'object' && input.objectId) {
                            const objType = objectTypeMap.get(input.objectId) || 'Unknown';
                            inputObjects.push({
                                objectId: input.objectId,
                                objectType: objType,
                                version: String(input.version) || '',
                            });
                        }
                    }
                }
            }

            // Extract gas payment objects
            if (tx.transaction?.data?.gasData?.payment) {
                for (const gasCoin of tx.transaction.data.gasData.payment) {
                    if (gasCoin.objectId) {
                        const objType = objectTypeMap.get(gasCoin.objectId) || '0x2::coin::Coin<0x2::iota::IOTA>';
                        inputObjects.push({
                            objectId: gasCoin.objectId,
                            objectType: objType,
                            version: String(gasCoin.version) || '',
                            isGas: true,
                        });
                    }
                }
            }

            return {
                digest,
                sender,
                checkpoint,
                timestamp,
                createdObjects,
                mutatedObjects,
                deletedObjects,
                inputObjects,
                recipients: [...new Set(recipients)],
                rawData: tx,
            };
        } catch (e: any) {
            console.error(`Failed to fetch transaction ${digest}:`, e);
            return null;
        }
    }

    async function fetchTransactionsForAddress(
        address: string,
        limit: number,
        afterCursor?: string | null,
    ): Promise<{ txs: TransactionNode[]; endCursor: string | null; hasMore: boolean }> {
        const config = getSelectedNetworkConfig();
        const graphqlClient = new IotaGraphQLClient({
            url: config.graphql,
        });

        const cursorSection = afterCursor ? `, after: "${afterCursor}"` : '';
        
        // Build filter object
        const filterParts = [`signAddress: $address`];
        if (afterCheckpoint && afterCheckpoint.trim()) {
            filterParts.push(`afterCheckpoint: ${parseInt(afterCheckpoint)}`);
        }
        if (beforeCheckpoint && beforeCheckpoint.trim()) {
            filterParts.push(`beforeCheckpoint: ${parseInt(beforeCheckpoint)}`);
        }
        const filterStr = `{ ${filterParts.join(', ')} }`;

        const result = await graphqlClient.query({
            query: `
                query GetTransactions($address: IotaAddress!, $limit: Int!) {
                    transactionBlocks(
                        filter: ${filterStr}
                        first: $limit${cursorSection}
                    ) {
                        pageInfo {
                            hasNextPage
                            endCursor
                        }
                        nodes {
                            digest
                        }
                    }
                }
            `,
            variables: {
                address,
                limit,
            },
        });

        const data = result.data as any;
        const digests =
            data?.transactionBlocks?.nodes?.map((n: any) => n.digest).filter(Boolean) || [];
        const hasMore = data?.transactionBlocks?.pageInfo?.hasNextPage || false;
        const endCursor = data?.transactionBlocks?.pageInfo?.endCursor || null;

        // Fetch full transaction details
        const txs: TransactionNode[] = [];
        for (const digest of digests) {
            const tx = await fetchTransactionByDigest(digest);
            if (tx) txs.push(tx);
        }

        return { txs, endCursor, hasMore };
    }

    async function fetchTransactionsByInputObject(objectId: string): Promise<TransactionNode[]> {
        const config = getSelectedNetworkConfig();
        const graphqlClient = new IotaGraphQLClient({
            url: config.graphql,
        });

        // Build filter object
        const filterParts = [`inputObject: $objectId`];
        if (afterCheckpoint && afterCheckpoint.trim()) {
            filterParts.push(`afterCheckpoint: ${parseInt(afterCheckpoint)}`);
        }
        if (beforeCheckpoint && beforeCheckpoint.trim()) {
            filterParts.push(`beforeCheckpoint: ${parseInt(beforeCheckpoint)}`);
        }
        const filterStr = `{ ${filterParts.join(', ')} }`;

        const result = await graphqlClient.query({
            query: `
                query GetTransactionsByObject($objectId: IotaAddress!) {
                    transactionBlocks(
                        filter: ${filterStr}
                        first: 50
                    ) {
                        nodes {
                            digest
                        }
                    }
                }
            `,
            variables: {
                objectId,
            },
        });

        const data = result.data as any;
        const digests =
            data?.transactionBlocks?.nodes?.map((n: any) => n.digest).filter(Boolean) || [];

        const txs: TransactionNode[] = [];
        for (const digest of digests) {
            if (!transactions.has(digest)) {
                const tx = await fetchTransactionByDigest(digest);
                if (tx) txs.push(tx);
            }
        }

        return txs;
    }

    function addTransaction(tx: TransactionNode) {
        if (transactions.has(tx.digest)) return;

        transactions.set(tx.digest, tx);
        transactions = new Map(transactions);

        // Update object-transaction mapping
        for (const obj of tx.createdObjects) {
            const existing = objectTransactionMap.get(obj.objectId) || { used: [] };
            existing.created = tx.digest;
            existing.type = obj.objectType;
            objectTransactionMap.set(obj.objectId, existing);
        }

        for (const obj of tx.mutatedObjects) {
            const existing = objectTransactionMap.get(obj.objectId) || { used: [] };
            if (!existing.used.includes(tx.digest)) {
                existing.used.push(tx.digest);
            }
            if (obj.objectType && obj.objectType !== 'Unknown') {
                existing.type = obj.objectType;
            }
            objectTransactionMap.set(obj.objectId, existing);
        }

        for (const obj of tx.inputObjects) {
            const existing = objectTransactionMap.get(obj.objectId) || { used: [] };
            if (!existing.used.includes(tx.digest)) {
                existing.used.push(tx.digest);
            }
            if (obj.objectType && obj.objectType !== 'Unknown') {
                existing.type = obj.objectType;
            }
            objectTransactionMap.set(obj.objectId, existing);
        }

        objectTransactionMap = new Map(objectTransactionMap);

        // Update address tx count
        updateAddressTxCounts();
    }

    function updateAddressTxCounts() {
        const counts = new Map<string, number>();
        for (const [, tx] of transactions) {
            const count = counts.get(tx.sender) || 0;
            counts.set(tx.sender, count + 1);
        }
        for (const [addr, state] of trackedAddresses) {
            state.txCount = counts.get(addr) || 0;
            trackedAddresses.set(addr, state);
        }
        trackedAddresses = new Map(trackedAddresses);
    }

    function addAddress(address: string, enabled: boolean = true) {
        if (!trackedAddresses.has(address)) {
            trackedAddresses.set(address, {
                enabled,
                label: `${address.slice(0, 8)}...${address.slice(-6)}`,
                txCount: 0,
            });
            trackedAddresses = new Map(trackedAddresses);
        }
    }

    async function processInitialInputs() {
        loading = true;
        error = '';

        try {
            const txIds = parseInputList(txIdsInput);
            const objectIds = parseInputList(objectIdsInput);
            const addresses = parseInputList(addressesInput);
            const limit = parseInt(fetchSize) || 5;

            // First, fetch provided transaction IDs and extract sender addresses
            for (const txId of txIds) {
                const tx = await fetchTransactionByDigest(txId);
                if (tx) {
                    addTransaction(tx);
                    addAddress(tx.sender);
                }
            }

            // Add provided addresses
            for (const addr of addresses) {
                addAddress(addr);
            }

            // Fetch transactions for object IDs
            for (const objId of objectIds) {
                const txs = await fetchTransactionsByInputObject(objId);
                for (const tx of txs) {
                    addTransaction(tx);
                    addAddress(tx.sender);
                }
            }

            // Fetch transactions for all addresses
            for (const [addr, state] of trackedAddresses) {
                if (state.enabled) {
                    const { txs, endCursor } = await fetchTransactionsForAddress(addr, limit);
                    for (const tx of txs) {
                        addTransaction(tx);
                    }
                    addressCursors.set(addr, endCursor);
                }
            }

            // Discover new addresses from recipients
            discoverNewAddresses();

            updateQueryParams();
        } catch (e: any) {
            error = `Error: ${e.message || e}`;
        } finally {
            loading = false;
        }
    }

    function discoverNewAddresses() {
        for (const [, tx] of transactions) {
            for (const recipient of tx.recipients) {
                if (!trackedAddresses.has(recipient)) {
                    addAddress(recipient, true);
                }
            }
        }
    }

    async function fetchMoreTransactions() {
        loading = true;
        error = '';

        try {
            const limit = parseInt(fetchSize) || 5;

            for (const [addr, state] of trackedAddresses) {
                if (state.enabled) {
                    const cursor = addressCursors.get(addr);
                    const { txs, endCursor } = await fetchTransactionsForAddress(
                        addr,
                        limit,
                        cursor,
                    );
                    for (const tx of txs) {
                        addTransaction(tx);
                    }
                    addressCursors.set(addr, endCursor);
                }
            }

            // Discover new addresses
            discoverNewAddresses();
        } catch (e: any) {
            error = `Error fetching more: ${e.message || e}`;
        } finally {
            loading = false;
        }
    }

    function toggleAddress(address: string) {
        const current = trackedAddresses.get(address);
        if (current) {
            current.enabled = !current.enabled;
            trackedAddresses.set(address, current);
            trackedAddresses = new Map(trackedAddresses);
        }
    }

    async function setCurrentEpochRange() {
        try {
            const config = getSelectedNetworkConfig();
            // @ts-ignore
            const fetcher = new GraphQLDataFetcher(config.graphql);
            const currentEpoch = await fetcher.getCurrentEpoch();
            if (currentEpoch) {
                const range = await fetcher.getCheckpointRangeForEpoch(parseInt(currentEpoch));
                afterCheckpoint = range.first.toString();
                beforeCheckpoint = range.last.toString();
                updateQueryParams();
            }
        } catch (e: any) {
            error = `Error getting epoch range: ${e.message || e}`;
        }
    }

    function updateQueryParams() {
        updatePageQueryParams({
            txIds: txIdsInput || null,
            objectIds: objectIdsInput || null,
            addresses: addressesInput || null,
            fetchSize,
            afterCheckpoint: afterCheckpoint || null,
            beforeCheckpoint: beforeCheckpoint || null,
            substringFilter: substringFilter || null,
        });
    }

    // Sort transactions by checkpoint (descending = most recent first at top)
    let sortedTransactions = $derived(
        Array.from(transactions.values())
            .filter((tx) => {
                // Filter out transactions from disabled addresses
                const addrState = trackedAddresses.get(tx.sender);
                if (addrState && !addrState.enabled) return false;

                // Filter by specific address if set
                if (filterByAddress && tx.sender !== filterByAddress) return false;

                // Filter by object ID if set
                if (filterByObjectId) {
                    const hasObject =
                        tx.createdObjects.some((o) => o.objectId === filterByObjectId) ||
                        tx.inputObjects.some((o) => o.objectId === filterByObjectId) ||
                        tx.mutatedObjects.some((o) => o.objectId === filterByObjectId) ||
                        tx.deletedObjects.includes(filterByObjectId);
                    if (!hasObject) return false;
                }

                // Substring filter - search across all tx data
                if (substringFilter.trim()) {
                    const searchLower = substringFilter.toLowerCase();
                    const searchFields = [
                        tx.digest,
                        tx.sender,
                        ...tx.createdObjects.map((o) => o.objectId + ' ' + o.objectType),
                        ...tx.mutatedObjects.map((o) => o.objectId + ' ' + o.objectType),
                        ...tx.deletedObjects,
                        ...tx.inputObjects.map((o) => o.objectId + ' ' + o.objectType),
                        ...tx.recipients,
                        tx.rawData ? JSON.stringify(tx.rawData) : '',
                    ];
                    const combined = searchFields.join(' ').toLowerCase();
                    if (!combined.includes(searchLower)) return false;
                }

                return true;
            })
            .sort((a, b) => b.checkpoint - a.checkpoint),
    );

    // Get objects that are shared between multiple transactions
    function getObjectConnections(objectId: string): string[] {
        const mapping = objectTransactionMap.get(objectId);
        if (!mapping) return [];

        const connectedTxs: string[] = [];
        if (mapping.created) connectedTxs.push(mapping.created);
        connectedTxs.push(...mapping.used);

        return [...new Set(connectedTxs)];
    }

    // Check if an object is part of the highlighted path
    function isObjectHighlighted(objectId: string): boolean {
        if (!hoveredObjectId) return false;
        return objectId === hoveredObjectId;
    }

    // Check if a transaction is part of the highlighted path
    function isTransactionHighlighted(txDigest: string): boolean {
        if (!hoveredObjectId) return false;
        const connections = getObjectConnections(hoveredObjectId);
        return connections.includes(txDigest);
    }

    function setObjectFilter(objectId: string) {
        if (filterByObjectId === objectId) {
            filterByObjectId = null;
        } else {
            filterByObjectId = objectId;
        }
    }

    function setAddressFilter(address: string) {
        if (filterByAddress === address) {
            filterByAddress = null;
        } else {
            filterByAddress = address;
        }
    }

    function clearFilters() {
        filterByObjectId = null;
        filterByAddress = null;
        substringFilter = '';
    }

    // Toggle expand/collapse for a single transaction
    function toggleTransactionExpand(digest: string) {
        if (expandedTransactions.has(digest)) {
            expandedTransactions.delete(digest);
        } else {
            expandedTransactions.add(digest);
        }
        expandedTransactions = new Set(expandedTransactions);
    }

    // Expand all objects in a transaction
    function expandAllInTransaction(tx: TransactionNode) {
        for (const obj of tx.inputObjects) {
            expandedInputObjects.add(makeExpandKey(tx.digest, obj.objectId));
        }
        for (const obj of tx.createdObjects) {
            expandedCreatedObjects.add(makeExpandKey(tx.digest, obj.objectId));
        }
        for (const obj of tx.mutatedObjects) {
            expandedMutatedObjects.add(makeExpandKey(tx.digest, obj.objectId));
        }
        expandedTransactions.add(tx.digest);
        expandedInputObjects = new Set(expandedInputObjects);
        expandedCreatedObjects = new Set(expandedCreatedObjects);
        expandedMutatedObjects = new Set(expandedMutatedObjects);
        expandedTransactions = new Set(expandedTransactions);
    }

    // Collapse all objects in a transaction
    function collapseAllInTransaction(tx: TransactionNode) {
        for (const obj of tx.inputObjects) {
            expandedInputObjects.delete(makeExpandKey(tx.digest, obj.objectId));
        }
        for (const obj of tx.createdObjects) {
            expandedCreatedObjects.delete(makeExpandKey(tx.digest, obj.objectId));
        }
        for (const obj of tx.mutatedObjects) {
            expandedMutatedObjects.delete(makeExpandKey(tx.digest, obj.objectId));
        }
        expandedTransactions.delete(tx.digest);
        expandedInputObjects = new Set(expandedInputObjects);
        expandedCreatedObjects = new Set(expandedCreatedObjects);
        expandedMutatedObjects = new Set(expandedMutatedObjects);
        expandedTransactions = new Set(expandedTransactions);
    }

    // Global expand/collapse all
    function toggleExpandAll() {
        if (allExpanded) {
            // Collapse all
            expandedInputObjects = new Set();
            expandedCreatedObjects = new Set();
            expandedMutatedObjects = new Set();
            expandedTransactions = new Set();
        } else {
            // Expand all
            for (const tx of sortedTransactions) {
                expandedTransactions.add(tx.digest);
                for (const obj of tx.inputObjects) {
                    expandedInputObjects.add(makeExpandKey(tx.digest, obj.objectId));
                }
                for (const obj of tx.createdObjects) {
                    expandedCreatedObjects.add(makeExpandKey(tx.digest, obj.objectId));
                }
                for (const obj of tx.mutatedObjects) {
                    expandedMutatedObjects.add(makeExpandKey(tx.digest, obj.objectId));
                }
            }
            expandedInputObjects = new Set(expandedInputObjects);
            expandedCreatedObjects = new Set(expandedCreatedObjects);
            expandedMutatedObjects = new Set(expandedMutatedObjects);
            expandedTransactions = new Set(expandedTransactions);
        }
        allExpanded = !allExpanded;
    }

    async function openTransactionPopup(digest: string) {
        const client = getClient();
        const tx = await client.getTransactionBlock({
            digest,
            options: {
                showInput: true,
                showRawInput: true,
                showEffects: true,
                showEvents: true,
                showObjectChanges: true,
                showBalanceChanges: true,
            },
        });
        selectedTransaction = tx;
        showTransactionPopup = true;
    }

    function openObjectPopup(objectId: string) {
        selectedObjectId = objectId;
        showObjectPopup = true;
    }

    function closeTransactionPopup() {
        showTransactionPopup = false;
        selectedTransaction = null;
    }

    function closeObjectPopup() {
        showObjectPopup = false;
        selectedObjectId = null;
    }

    function formatTimestamp(ts: string): string {
        if (!ts) return '';
        const date = new Date(parseInt(ts));
        return date.toLocaleString();
    }

    function shortenId(id: string, chars: number = 6): string {
        if (id.length <= chars * 2 + 3) return id;
        return `${id.slice(0, chars)}...${id.slice(-chars)}`;
    }

    function shortenType(type: string): string {
        // Extract just the struct name from a full type like "0x2::coin::Coin<0x2::iota::IOTA>"
        const match = type.match(/::([^:]+?)(?:<|$)/);
        if (match) return match[1];
        return type.slice(0, 20);
    }

    function renderGraph() {
        if (!svgElement || !graphContainer || viewMode !== 'graph' || sortedTransactions.length === 0) return;

        // Clear previous graph
        d3.select(svgElement).selectAll('*').remove();

        const width = graphContainer.clientWidth;
        const height = graphContainer.clientHeight || 600;

        const svg = d3.select(svgElement)
            .attr('width', width)
            .attr('height', height);

        // Prepare nodes and links
        const nodes: (d3.SimulationNodeDatum & { id: string; tx: TransactionNode })[] = sortedTransactions.map(tx => ({
            id: tx.digest,
            tx,
        }));

        const links: (d3.SimulationLinkDatum<d3.SimulationNodeDatum & { id: string; tx: TransactionNode }> & { objectId: string })[] = [];

        const txIds = new Set(sortedTransactions.map(tx => tx.digest));
        const txMap = new Map(sortedTransactions.map(tx => [tx.digest, tx]));

        for (const [objId, mapping] of objectTransactionMap) {
            const outputVersions: { tx: string; version: string }[] = [];
            if (mapping.created && txIds.has(mapping.created)) {
                const tx = txMap.get(mapping.created);
                const createdObj = tx?.createdObjects.find(o => o.objectId === objId);
                if (createdObj?.version) {
                    outputVersions.push({ tx: mapping.created, version: createdObj.version });
                }
            }
            // Also add txs that mutated it
            for (const usedTx of mapping.used) {
                if (txIds.has(usedTx)) {
                    const tx = txMap.get(usedTx);
                    const mutatedObj = tx?.mutatedObjects.find(o => o.objectId === objId);
                    if (mutatedObj?.version) {
                        outputVersions.push({ tx: usedTx, version: mutatedObj.version });
                    }
                }
            }
            const inputVersions: { tx: string; version: string }[] = [];
            for (const usedTx of mapping.used) {
                if (txIds.has(usedTx)) {
                    const tx = txMap.get(usedTx);
                    const inputObj = tx?.inputObjects.find(o => o.objectId === objId);
                    if (inputObj?.version) {
                        inputVersions.push({ tx: usedTx, version: inputObj.version });
                    }
                }
            }
            for (const output of outputVersions) {
                for (const input of inputVersions) {
                    if (output.tx !== input.tx && output.version === input.version) {
                        const outTx = txMap.get(output.tx);
                        const inTx = txMap.get(input.tx);
                        if (outTx && inTx && outTx.checkpoint < inTx.checkpoint) {
                            links.push({
                                source: output.tx,
                                target: input.tx,
                                objectId: objId,
                            });
                        }
                    }
                }
            }
        }

        // Additional links for version matching with inputs
        const outputVersionMap = new Map<string, string[]>(); // version to txs that output it
        const inputVersionMap = new Map<string, string[]>(); // version to txs that input it
        for (const tx of sortedTransactions) {
            for (const obj of tx.createdObjects) {
                if (obj.version) {
                    if (!outputVersionMap.has(obj.version)) outputVersionMap.set(obj.version, []);
                    outputVersionMap.get(obj.version)!.push(tx.digest);
                }
            }
            for (const obj of tx.mutatedObjects) {
                if (obj.version) {
                    if (!outputVersionMap.has(obj.version)) outputVersionMap.set(obj.version, []);
                    outputVersionMap.get(obj.version)!.push(tx.digest);
                }
            }
            for (const obj of tx.inputObjects) {
                if (obj.version) {
                    if (!inputVersionMap.has(obj.version)) inputVersionMap.set(obj.version, []);
                    inputVersionMap.get(obj.version)!.push(tx.digest);
                }
            }
        }
        for (const [version, outputTxs] of outputVersionMap) {
            const inputTxs = inputVersionMap.get(version) || [];
            for (const outTx of outputTxs) {
                for (const inTx of inputTxs) {
                    const outTxData = txMap.get(outTx);
                    const inTxData = txMap.get(inTx);
                    if (outTx !== inTx && outTxData && inTxData && outTxData.checkpoint < inTxData.checkpoint) {
                        // Check if not already linked by objectId
                        const alreadyLinked = links.some(l => l.source === outTx && l.target === inTx);
                        if (!alreadyLinked) {
                            links.push({
                                source: outTx,
                                target: inTx,
                                objectId: `version-${version}`,
                            });
                        }
                    }
                }
            }
        }

        // Group nodes by checkpoint for layered layout
        const checkpointGroups = new Map<number, typeof nodes>();
        for (const node of nodes) {
            const cp = node.tx.checkpoint;
            if (!checkpointGroups.has(cp)) checkpointGroups.set(cp, []);
            checkpointGroups.get(cp)!.push(node);
        }

        // Sort checkpoints
        const sortedCheckpoints = Array.from(checkpointGroups.keys()).sort((a, b) => a - b);

        // Assign y positions to layers
        const layerHeight = height / (sortedCheckpoints.length * 1.5 + 1);
        sortedCheckpoints.forEach((cp, index) => {
            const layerNodes = checkpointGroups.get(cp)!;
            const y = layerHeight * (index + 1);
            layerNodes.forEach(node => {
                (node as any).fy = y;
            });
        });

        // Create force simulation with layered y positions
        const simulation = d3.forceSimulation(nodes)
            .force('link', d3.forceLink<d3.SimulationNodeDatum & { id: string; tx: TransactionNode }, d3.SimulationLinkDatum<d3.SimulationNodeDatum & { id: string; tx: TransactionNode }>>(links).id(d => d.id).distance(100))
            .force('charge', d3.forceManyBody().strength(-300))
            .force('x', d3.forceX(width / 2).strength(0.1))
            .force('y', d3.forceY().strength(1).y(d => (d as any).fy));

        // Add zoom behavior
        const zoom = d3.zoom<SVGSVGElement, unknown>()
            .scaleExtent([0.1, 4])
            .on('zoom', (event) => {
                g.attr('transform', event.transform);
            });

        svg.call(zoom);

        const g = svg.append('g');

        // Add arrow marker
        svg.append('defs').append('marker')
            .attr('id', 'arrowhead')
            .attr('viewBox', '-0 -5 10 10')
            .attr('refX', 25)
            .attr('refY', 0)
            .attr('orient', 'auto')
            .attr('markerWidth', 6)
            .attr('markerHeight', 6)
            .attr('xoverflow', 'visible')
            .append('svg:path')
            .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
            .attr('fill', '#999')
            .attr('stroke', 'none');

        // Draw links
        const link = g.append('g')
            .attr('class', 'links')
            .selectAll('line')
            .data(links)
            .enter().append('line')
            .attr('stroke', '#999')
            .attr('stroke-opacity', 0.8)
            .attr('stroke-width', 3)
            .attr('marker-end', 'url(#arrowhead)');

        // Draw nodes
        const node = g.append('g')
            .attr('class', 'nodes')
            .selectAll('circle')
            .data(nodes)
            .enter().append('circle')
            .attr('r', 15)
            .attr('fill', '#3b82f6')
            .attr('stroke', '#1e40af')
            .attr('stroke-width', 2)
            .on('click', (event, d) => openTransactionPopup(d.tx.digest))
            .call(d3.drag<SVGCircleElement, d3.SimulationNodeDatum & { id: string; tx: TransactionNode }>()
                .on('start', (event, d) => {
                    if (!event.active) simulation.alphaTarget(0.3).restart();
                    (d as any).fx = d.x;
                    (d as any).fy = (d as any).fy; // Keep y fixed to layer
                })
                .on('drag', (event, d) => {
                    (d as any).fx = event.x;
                    // Prevent y dragging to maintain layers
                })
                .on('end', (event, d) => {
                    if (!event.active) simulation.alphaTarget(0);
                    (d as any).fx = null;
                }));

        // Add labels
        const labels = g.append('g')
            .attr('class', 'labels')
            .selectAll('text')
            .data(nodes)
            .enter().append('text')
            .attr('dy', -20)
            .attr('text-anchor', 'middle')
            .attr('font-size', '10px')
            .attr('fill', '#fff')
            .text(d => shortenId(d.tx.digest, 8));

        // Update positions
        simulation.on('tick', () => {
            link
                .attr('x1', d => (d.source as any).x)
                .attr('y1', d => (d.source as any).y)
                .attr('x2', d => (d.target as any).x)
                .attr('y2', d => (d.target as any).y);

            node
                .attr('cx', d => d.x!)
                .attr('cy', d => d.y!);

            labels
                .attr('x', d => d.x!)
                .attr('y', d => d.y!);
        });
    }

    // Initialize from query parameters
    onMount(() => {
        const params = $pageParams;
        if (params.txIds) txIdsInput = params.txIds;
        if (params.objectIds) objectIdsInput = params.objectIds;
        if (params.addresses) addressesInput = params.addresses;
        if (params.fetchSize) fetchSize = params.fetchSize;
        if (params.afterCheckpoint) afterCheckpoint = params.afterCheckpoint;
        if (params.beforeCheckpoint) beforeCheckpoint = params.beforeCheckpoint;
        if (params.substringFilter) substringFilter = params.substringFilter;

        // Auto-process if any input is provided
        if (params.txIds || params.objectIds || params.addresses) {
            processInitialInputs();
        }
    });

    // Render graph when data changes
    $effect(() => {
        if (viewMode === 'graph' && sortedTransactions.length > 0) {
            // Delay to ensure DOM is ready
            setTimeout(renderGraph, 100);
        }
    });
</script>

<div class="history-page">
    <div class="input-section">
        <div class="input-row">
            <label for="tx-ids">Tx IDs:</label>
            <input
                type="text"
                id="tx-ids"
                bind:value={txIdsInput}
                placeholder="Transaction digests (comma or newline separated)"
            />
        </div>

        <div class="input-row">
            <label for="object-ids">Object IDs:</label>
            <input
                type="text"
                id="object-ids"
                bind:value={objectIdsInput}
                placeholder="Object IDs to find transactions"
            />
        </div>

        <div class="input-row">
            <label for="addresses">Addresses:</label>
            <input
                type="text"
                id="addresses"
                bind:value={addressesInput}
                placeholder="Addresses to fetch transactions"
            />
        </div>

        <div class="controls-row">
            <button onclick={processInitialInputs} disabled={loading}>
                {loading ? 'Loading...' : 'Load'}
            </button>

            <div class="fetch-size-control">
                <label for="fetch-size">Size:</label>
                <select id="fetch-size" bind:value={fetchSize} onchange={() => updateQueryParams()}>
                    <option value="1">1</option>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                </select>
            </div>

            <button onclick={fetchMoreTransactions} disabled={loading || transactions.size === 0}>
                {loading ? 'Loading...' : 'More'}
            </button>

            <button onclick={toggleExpandAll} disabled={sortedTransactions.length === 0}>
                {allExpanded ? '⊟ Collapse All' : '⊞ Expand All'}
            </button>

            <button onclick={() => viewMode = viewMode === 'list' ? 'graph' : 'list'}>
                {viewMode === 'list' ? '📊 Graph View' : '📋 List View'}
            </button>

            <div class="checkpoint-control">
                <label for="after-checkpoint">After Checkpoint:</label>
                <input
                    type="number"
                    id="after-checkpoint"
                    bind:value={afterCheckpoint}
                    oninput={() => updateQueryParams()}
                    placeholder="Optional"
                />
            </div>

            <div class="checkpoint-control">
                <label for="before-checkpoint">Before Checkpoint:</label>
                <input
                    type="number"
                    id="before-checkpoint"
                    bind:value={beforeCheckpoint}
                    oninput={() => updateQueryParams()}
                    placeholder="Optional"
                />
            </div>

            <button onclick={setCurrentEpochRange} disabled={loading}>
                Current Epoch
            </button>

            <div class="search-control">
                <label for="substring-filter">🔍</label>
                <input
                    type="text"
                    id="substring-filter"
                    bind:value={substringFilter}
                    oninput={() => updateQueryParams()}
                    placeholder="Filter by substring..."
                />
            </div>
        </div>
    </div>

    {#if error}
        <div class="error-message">
            {error}
        </div>
    {/if}

    <!-- Active Filters Display -->
    {#if filterByObjectId || filterByAddress || substringFilter}
        <div class="active-filters">
            <span>Active Filters:</span>
            {#if substringFilter}
                <span class="filter-tag">
                    Search: "{substringFilter}"
                    <button class="filter-remove" onclick={() => substringFilter = ''}>×</button>
                </span>
            {/if}
            {#if filterByObjectId}
                <span class="filter-tag">
                    Object: {shortenId(filterByObjectId, 6)}
                    <button class="filter-remove" onclick={() => filterByObjectId = null}>×</button>
                </span>
            {/if}
            {#if filterByAddress}
                <span class="filter-tag">
                    Address: {shortenId(filterByAddress, 6)}
                    <button class="filter-remove" onclick={() => filterByAddress = null}>×</button>
                </span>
            {/if}
            <button class="clear-filters-btn" onclick={clearFilters}>Clear All</button>
        </div>
    {/if}

    <div class="main-content">
        <!-- Address List Sidebar -->
        <div class="address-sidebar">
            <h4>Tracked Addresses ({trackedAddresses.size})</h4>
            <div class="address-list">
                {#each [...trackedAddresses] as [address, state]}
                    <div class="address-item" class:disabled={!state.enabled} class:filtered={filterByAddress === address}>
                        <label class="address-toggle">
                            <input
                                type="checkbox"
                                checked={state.enabled}
                                onchange={() => toggleAddress(address)}
                            />
                            <span class="address-label" title={address}>
                                {state.label}
                            </span>
                        </label>
                        <span class="tx-count" title="Number of transactions">{state.txCount}</span>
                        <button
                            class="filter-btn"
                            class:active={filterByAddress === address}
                            onclick={() => setAddressFilter(address)}
                            title={filterByAddress === address ? 'Clear filter' : 'Filter by this address'}
                        >
                            🔍
                        </button>
                        <a
                            href={getAddressLink(getSelectedNetworkConfig(), address)}
                            target="_blank"
                            class="explorer-icon"
                            title="View in explorer"
                        >
                            ↗
                        </a>
                    </div>
                {/each}
            </div>
        </div>

        <!-- Transaction Graph -->
        <div class="graph-container">
            {#if viewMode === 'list'}
                {#if loading && transactions.size === 0}
                    <div class="loading-message">
                        <div class="spinner"></div>
                        <span>Loading transactions...</span>
                    </div>
                {:else if sortedTransactions.length === 0}
                    <div class="empty-message">
                        No transactions to display. Enter transaction IDs, object IDs, or addresses
                        above.
                    </div>
                {:else}
                    <div class="timeline">
                    {#each sortedTransactions as tx, index}
                        {@const prevTx = index > 0 ? sortedTransactions[index - 1] : null}
                        {@const hasConnection =
                            prevTx &&
                            [...tx.createdObjects.map((o) => o.objectId), ...tx.mutatedObjects.map((o) => o.objectId)].some(
                                (objId) =>
                                    prevTx.inputObjects.some((o) => o.objectId === objId) ||
                                    prevTx.mutatedObjects.some((o) => o.objectId === objId),
                            )}
                        {@const isExpanded = expandedTransactions.has(tx.digest)}
                        {@const inputCount = tx.inputObjects.length}
                        {@const outputCount = tx.createdObjects.length + tx.mutatedObjects.length + tx.deletedObjects.length}
                        <div
                            class="timeline-item"
                            class:highlighted={isTransactionHighlighted(tx.digest)}
                        >
                            <div class="transaction-card">
                                <!-- Left panel: Tx info -->
                                <div class="tx-left-panel">
                                    <span
                                        class="tx-digest"
                                        title={tx.digest}
                                        onclick={() => openTransactionPopup(tx.digest)}
                                        onkeydown={(e) => e.key === 'Enter' && openTransactionPopup(tx.digest)}
                                        role="button"
                                        tabindex="0"
                                    >
                                        {shortenId(tx.digest, 10)}
                                    </span>
                                    <span class="tx-sender-label" title={tx.sender}>
                                        {shortenId(tx.sender, 8)}
                                    </span>
                                    <span class="tx-time">{formatTimestamp(tx.timestamp)}</span>
                                    <span class="checkpoint-badge">#{tx.checkpoint}</span>
                                </div>

                                <!-- Right panel: Objects -->
                                <div class="tx-right-panel">
                                {#if tx.inputObjects.length > 0}
                                    {@const allInputsExpanded = areAllInSectionExpanded(tx, 'inputs')}
                                    <div class="tx-section inputs-section">
                                        <button class="section-toggle" onclick={(e) => { e.stopPropagation(); toggleAllInSection(tx, 'inputs'); }} title={allInputsExpanded ? 'Collapse all inputs' : 'Expand all inputs'}>
                                            {allInputsExpanded ? '▼' : '▶'}
                                        </button>
                                        <span class="section-label">Inputs({tx.inputObjects.length}):</span>
                                        <div class="objects-inline">
                                            {#each tx.inputObjects as obj}
                                                {@const connections = getObjectConnections(obj.objectId)}
                                                {@const objExpanded = expandedInputObjects.has(makeExpandKey(tx.digest, obj.objectId))}
                                                <div class="object-item">
                                                    <div
                                                        class="object-chip input-chip"
                                                        class:connected={connections.length > 1}
                                                        class:highlighted={isObjectHighlighted(obj.objectId)}
                                                        role="presentation"
                                                        onmouseenter={() => (hoveredObjectId = obj.objectId)}
                                                        onmouseleave={() => (hoveredObjectId = null)}
                                                    >
                                                        <button
                                                            class="expand-btn"
                                                            onclick={(e) => {
                                                                e.stopPropagation();
                                                                toggleExpandInput(tx.digest, obj.objectId);
                                                            }}
                                                            title={objExpanded ? 'Collapse' : 'Expand'}
                                                        >
                                                            {objExpanded ? '▼' : '▶'}
                                                        </button>
                                                        <span class="obj-type">{shortenType(obj.objectType)}</span>
                                                        <span class="obj-id">{shortenId(obj.objectId, 4)}</span>
                                                        {#if connections.length > 1}
                                                            <span class="connection-indicator">🔗{connections.length}</span>
                                                        {/if}
                                                        <button
                                                            class="filter-obj-btn"
                                                            class:active={filterByObjectId === obj.objectId}
                                                            onclick={(e) => {
                                                                e.stopPropagation();
                                                                setObjectFilter(obj.objectId);
                                                            }}
                                                            title="Filter by this object"
                                                        >
                                                            🔍
                                                        </button>
                                                    </div>
                                                    {#if objExpanded}
                                                        <div class="expanded-object" role="button" tabindex="0" onclick={(e) => e.stopPropagation()} onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.currentTarget.click(); } }}>
                                                            <ObjectView objectId={obj.objectId} />
                                                        </div>
                                                    {/if}
                                                </div>
                                            {/each}
                                        </div>
                                    </div>
                                {/if}

                                <!-- Outputs Section: Created -->
                                {#if tx.createdObjects.length > 0}
                                    {@const allCreatedExpanded = areAllInSectionExpanded(tx, 'created')}
                                    <div class="tx-section outputs-section">
                                        <button class="section-toggle" onclick={(e) => { e.stopPropagation(); toggleAllInSection(tx, 'created'); }} title={allCreatedExpanded ? 'Collapse all created' : 'Expand all created'}>
                                            {allCreatedExpanded ? '▼' : '▶'}
                                        </button>
                                        <span class="section-label">Created({tx.createdObjects.length}):</span>
                                        <div class="objects-inline">
                                            {#each tx.createdObjects as obj}
                                                {@const connections = getObjectConnections(obj.objectId)}
                                                {@const objExpanded = expandedCreatedObjects.has(makeExpandKey(tx.digest, obj.objectId))}
                                                <div class="object-item">
                                                    <div
                                                        class="object-chip created-chip"
                                                        class:connected={connections.length > 1}
                                                        class:highlighted={isObjectHighlighted(obj.objectId)}
                                                        role="presentation"
                                                        onmouseenter={() => (hoveredObjectId = obj.objectId)}
                                                        onmouseleave={() => (hoveredObjectId = null)}
                                                    >
                                                        <button
                                                            class="expand-btn"
                                                            onclick={(e) => {
                                                                e.stopPropagation();
                                                                toggleExpandCreated(tx.digest, obj.objectId);
                                                            }}
                                                            title={objExpanded ? 'Collapse' : 'Expand'}
                                                        >
                                                            {objExpanded ? '▼' : '▶'}
                                                        </button>
                                                        <span class="obj-type">{shortenType(obj.objectType)}</span>
                                                        <span class="obj-id">{shortenId(obj.objectId, 4)}</span>
                                                        {#if connections.length > 1}
                                                            <span class="connection-indicator">🔗{connections.length}</span>
                                                        {/if}
                                                        <button
                                                            class="filter-obj-btn"
                                                            class:active={filterByObjectId === obj.objectId}
                                                            onclick={(e) => {
                                                                e.stopPropagation();
                                                                setObjectFilter(obj.objectId);
                                                            }}
                                                            title="Filter by this object"
                                                        >
                                                            🔍
                                                        </button>
                                                    </div>
                                                    {#if objExpanded}
                                                        <div class="expanded-object" role="button" tabindex="0" onclick={(e) => e.stopPropagation()} onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.currentTarget.click(); } }}>
                                                            <ObjectView objectId={obj.objectId} />
                                                        </div>
                                                    {/if}
                                                </div>
                                            {/each}
                                        </div>
                                    </div>
                                {/if}

                                <!-- Outputs Section: Mutated -->
                                {#if tx.mutatedObjects.length > 0}
                                    {@const allMutatedExpanded = areAllInSectionExpanded(tx, 'mutated')}
                                    <div class="tx-section outputs-section">
                                        <button class="section-toggle" onclick={(e) => { e.stopPropagation(); toggleAllInSection(tx, 'mutated'); }} title={allMutatedExpanded ? 'Collapse all mutated' : 'Expand all mutated'}>
                                            {allMutatedExpanded ? '▼' : '▶'}
                                        </button>
                                        <span class="section-label">Mutated({tx.mutatedObjects.length}):</span>
                                        <div class="objects-inline">
                                            {#each tx.mutatedObjects as obj}
                                                {@const connections = getObjectConnections(obj.objectId)}
                                                {@const objExpanded = expandedMutatedObjects.has(makeExpandKey(tx.digest, obj.objectId))}
                                                <div class="object-item">
                                                    <div
                                                        class="object-chip mutated-chip"
                                                        class:connected={connections.length > 1}
                                                        class:highlighted={isObjectHighlighted(obj.objectId)}
                                                        role="presentation"
                                                        onmouseenter={() => (hoveredObjectId = obj.objectId)}
                                                        onmouseleave={() => (hoveredObjectId = null)}
                                                    >
                                                        <button
                                                            class="expand-btn"
                                                            onclick={(e) => {
                                                                e.stopPropagation();
                                                                toggleExpandMutated(tx.digest, obj.objectId);
                                                            }}
                                                            title={objExpanded ? 'Collapse' : 'Expand'}
                                                        >
                                                            {objExpanded ? '▼' : '▶'}
                                                        </button>
                                                        <span class="obj-type">{shortenType(obj.objectType)}</span>
                                                        <span class="obj-id">{shortenId(obj.objectId, 4)}</span>
                                                        {#if connections.length > 1}
                                                            <span class="connection-indicator">🔗{connections.length}</span>
                                                        {/if}
                                                        <button
                                                            class="filter-obj-btn"
                                                            class:active={filterByObjectId === obj.objectId}
                                                            onclick={(e) => {
                                                                e.stopPropagation();
                                                                setObjectFilter(obj.objectId);
                                                            }}
                                                            title="Filter by this object"
                                                        >
                                                            🔍
                                                        </button>
                                                    </div>
                                                    {#if objExpanded}
                                                        <div class="expanded-object" role="button" tabindex="0" onclick={(e) => e.stopPropagation()} onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.currentTarget.click(); } }}>
                                                            <ObjectView objectId={obj.objectId} />
                                                        </div>
                                                    {/if}
                                                </div>
                                            {/each}
                                        </div>
                                    </div>
                                {/if}

                                <!-- Outputs Section: Deleted -->
                                {#if tx.deletedObjects.length > 0}
                                    <div class="tx-section outputs-section">
                                        <span class="section-label-plain">Deleted({tx.deletedObjects.length}):</span>
                                        <div class="objects-inline">
                                            {#each tx.deletedObjects as objId}
                                                <div class="object-item">
                                                    <div class="object-chip deleted-chip">
                                                        <span class="obj-id">{shortenId(objId, 6)}</span>
                                                        <button
                                                            class="filter-obj-btn"
                                                            class:active={filterByObjectId === objId}
                                                            onclick={(e) => {
                                                                e.stopPropagation();
                                                                setObjectFilter(objId);
                                                            }}
                                                            title="Filter by this object"
                                                        >
                                                            🔍
                                                        </button>
                                                    </div>
                                                </div>
                                            {/each}
                                        </div>
                                    </div>
                                {/if}
                                </div><!-- end tx-right-panel -->
                            </div>

                            <!-- Connection line to next transaction -->
                            {#if hasConnection}
                                <div class="connection-line"></div>
                            {/if}
                        </div>
                    {/each}
                </div>
            {/if}

            {:else}
                <!-- Graph View -->
                <div class="graph-view" bind:this={graphContainer}>
                    {#if sortedTransactions.length === 0}
                        <div class="empty-message">
                            No transactions to display. Enter transaction IDs, object IDs, or addresses above.
                        </div>
                    {:else}
                        <svg class="graph-svg" bind:this={svgElement}></svg>
                    {/if}
                </div>
            {/if}

        </div>
    </div>

    <!-- Transaction Popup Modal -->
    {#if showTransactionPopup && selectedTransaction}
        <div class="modal-overlay" onclick={closeTransactionPopup} role="button" tabindex="0" onkeydown={(e) => e.key === 'Escape' && closeTransactionPopup()}>
            <div class="modal-content" onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.stopPropagation()} role="dialog" tabindex="-1">
                <TransactionView bind:value={selectedTransaction} />
            </div>
        </div>
    {/if}

    <!-- Object Popup Modal -->
    {#if showObjectPopup && selectedObjectId}
        <div class="modal-overlay" onclick={closeObjectPopup} role="button" tabindex="0" onkeydown={(e) => e.key === 'Escape' && closeObjectPopup()}>
            <div class="modal-content" onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.stopPropagation()} role="dialog" tabindex="-1">
                <ObjectView objectId={selectedObjectId} onClose={closeObjectPopup} />
            </div>
        </div>
    {/if}
</div>

<style>
    .history-page {
        width: 100%;
        margin: 0 auto;
        padding: 0.5rem;
        min-height: 100vh;
    }

    h4 {
        color: rgba(255, 255, 255, 0.85);
        margin: 0 0 0.75rem 0;
        font-size: 1rem;
    }

    .input-section {
        margin-bottom: 0.5rem;
        padding: 0.5rem 0.75rem;
        background: rgba(30, 30, 40, 0.4);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
    }

    .input-row {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.25rem;
    }

    .input-row label {
        width: 70px;
        flex-shrink: 0;
        color: rgba(255, 255, 255, 0.85);
        font-weight: 500;
        font-size: 0.8rem;
        text-align: right;
    }

    .input-row input[type='text'] {
        flex: 1;
        padding: 0.3rem 0.5rem;
        background: rgba(30, 30, 40, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        color: rgba(255, 255, 255, 0.9);
        font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
        font-size: 0.75rem;
    }

    .input-row input[type='text']:focus {
        outline: none;
        border-color: rgba(59, 130, 246, 0.5);
    }

    .controls-row {
        display: flex;
        gap: 0.4rem;
        align-items: center;
        flex-wrap: wrap;
        margin-top: 0.35rem;
        padding-left: 75px;
    }

    .checkpoint-control {
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }

    .checkpoint-control label {
        font-size: 0.75rem;
        color: rgba(255, 255, 255, 0.85);
        white-space: nowrap;
    }

    .checkpoint-control input[type='number'] {
        width: 100px;
        padding: 0.3rem 0.4rem;
        background: rgba(30, 30, 40, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        color: rgba(255, 255, 255, 0.9);
        font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
        font-size: 0.75rem;
    }

    .checkpoint-control input[type='number']:focus {
        outline: none;
        border-color: rgba(59, 130, 246, 0.5);
    }

    .search-control {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        margin-left: auto;
    }

    .search-control label {
        font-size: 0.85rem;
    }

    .search-control input[type='text'] {
        width: 180px;
        padding: 0.3rem 0.5rem;
        background: rgba(30, 30, 40, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        color: rgba(255, 255, 255, 0.9);
        font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
        font-size: 0.75rem;
    }

    .search-control input[type='text']:focus {
        outline: none;
        border-color: rgba(59, 130, 246, 0.5);
    }

    .fetch-size-control {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .fetch-size-control label {
        color: rgba(255, 255, 255, 0.85);
        font-size: 0.9rem;
    }

    .fetch-size-control select {
        padding: 0.4rem 0.6rem;
        background: var(--primary-color);
        border: 1px solid var(--border-color);
        border-radius: 4px;
        color: white;
        font-size: 0.85rem;
        cursor: pointer;
    }

    button {
        padding: 0.5rem 1rem;
        background: var(--primary-color);
        border: 1px solid var(--border-color);
        border-radius: 4px;
        color: white;
        font-weight: 500;
        cursor: pointer;
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

    .main-content {
        display: flex;
        gap: 1rem;
    }

    /* Address Sidebar */
    .address-sidebar {
        width: 250px;
        flex-shrink: 0;
        padding: 1rem;
        background: rgba(30, 30, 40, 0.4);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        max-height: calc(100vh - 300px);
        overflow-y: auto;
    }

    .address-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .address-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem;
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 4px;
        transition: all 0.2s;
    }

    .address-item.disabled {
        opacity: 0.5;
    }

    .address-item.filtered {
        border-color: rgba(59, 130, 246, 0.5);
        background: rgba(59, 130, 246, 0.1);
    }

    .address-toggle {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        flex: 1;
        min-width: 0;
    }

    .address-toggle input[type='checkbox'] {
        width: 16px;
        height: 16px;
        cursor: pointer;
        flex-shrink: 0;
    }

    .address-label {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.8rem;
        color: rgba(255, 255, 255, 0.85);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .tx-count {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.75rem;
        color: rgba(255, 255, 255, 0.6);
        background: rgba(255, 255, 255, 0.1);
        padding: 0.15rem 0.4rem;
        border-radius: 8px;
        flex-shrink: 0;
    }

    .address-item .filter-btn {
        padding: 0.2rem 0.4rem;
        font-size: 0.75rem;
    }

    .explorer-icon {
        color: rgba(59, 130, 246, 1);
        text-decoration: none;
        font-size: 0.9rem;
        flex-shrink: 0;
    }

    .explorer-icon:hover {
        color: rgba(59, 130, 246, 0.8);
    }

    /* Graph Container */
    .graph-container {
        flex: 1;
        min-height: 400px;
    }

    .graph-view {
        width: 100%;
        height: 600px;
        background: rgba(30, 30, 40, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
    }

    .graph-svg {
        width: 100%;
        height: 100%;
        background: rgba(30, 30, 40, 0.6);
    }

    .loading-message,
    .empty-message {
        padding: 2rem;
        text-align: center;
        color: rgba(255, 255, 255, 0.7);
        background: rgba(30, 30, 40, 0.4);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
    }

    .loading-message {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        color: rgba(59, 130, 246, 1);
    }

    .spinner {
        width: 24px;
        height: 24px;
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

    /* Timeline */
    .timeline {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        position: relative;
    }

    .timeline-item {
        position: relative;
        padding: 0.15rem 0;
        transition: all 0.2s;
    }

    .timeline-item.highlighted {
        background: rgba(59, 130, 246, 0.1);
        border-radius: 6px;
    }

    .checkpoint-badge {
        display: inline-block;
        padding: 0.15rem 0.35rem;
        background: rgba(59, 130, 246, 0.2);
        border: 1px solid rgba(59, 130, 246, 0.3);
        border-radius: 4px;
        font-size: 0.7rem;
        color: rgba(59, 130, 246, 1);
        font-family: 'JetBrains Mono', monospace;
    }

    .transaction-card {
        background: rgba(30, 30, 40, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 6px;
        padding: 0.4rem 0.6rem;
        transition: all 0.2s;
        display: flex;
        gap: 0.75rem;
    }

    .transaction-card:hover {
        border-color: rgba(59, 130, 246, 0.3);
        background: rgba(30, 30, 40, 0.8);
    }

    .tx-left-panel {
        display: flex;
        flex-direction: column;
        gap: 0.15rem;
        min-width: 160px;
        max-width: 160px;
        flex-shrink: 0;
        padding-right: 0.5rem;
        border-right: 1px solid rgba(255, 255, 255, 0.1);
    }

    .tx-right-panel {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        min-width: 0;
    }

    .tx-digest {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.75rem;
        color: rgba(59, 130, 246, 1);
        font-weight: 600;
        cursor: pointer;
    }

    .tx-digest:hover {
        text-decoration: underline;
    }

    .tx-sender-label {
        font-size: 0.7rem;
        color: rgba(255, 255, 255, 0.6);
        font-family: 'JetBrains Mono', monospace;
    }

    .tx-time {
        font-size: 0.65rem;
        color: rgba(255, 255, 255, 0.5);
    }

    .section-toggle {
        background: none;
        border: none;
        color: rgba(255, 255, 255, 0.7);
        padding: 0;
        font-size: 0.65rem;
        cursor: pointer;
        width: 14px;
        flex-shrink: 0;
    }

    .section-toggle:hover {
        color: rgba(255, 255, 255, 1);
    }

    .tx-section {
        display: flex;
        align-items: flex-start;
        gap: 0.5rem;
    }

    .section-label {
        font-size: 0.75rem;
        color: rgba(255, 255, 255, 0.6);
        flex-shrink: 0;
    }

    .section-label-plain {
        font-size: 0.75rem;
        color: rgba(255, 255, 255, 0.6);
        flex-shrink: 0;
        margin-left: 14px; /* align with sections that have toggle button */
    }
    .objects-inline {
        display: flex;
        flex-wrap: wrap;
        gap: 0.3rem;
        align-items: flex-start;
    }

    .object-item {
        display: flex;
        flex-direction: column;
    }

    .object-chip {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        padding: 0.2rem 0.4rem;
        border-radius: 3px;
        font-size: 0.7rem;
        transition: all 0.2s;
    }

    .object-chip:hover {
        filter: brightness(1.2);
    }

    .object-chip.connected {
        border-color: rgba(251, 191, 36, 0.5);
        background: rgba(251, 191, 36, 0.15);
    }

    .object-chip.highlighted {
        background: rgba(251, 191, 36, 0.3);
        border-color: rgba(251, 191, 36, 0.8);
        box-shadow: 0 0 6px rgba(251, 191, 36, 0.4);
    }

    .object-chip.input-chip {
        background: rgba(139, 92, 246, 0.15);
        border: 1px solid rgba(139, 92, 246, 0.3);
    }

    .object-chip.created-chip {
        background: rgba(16, 185, 129, 0.15);
        border: 1px solid rgba(16, 185, 129, 0.3);
    }

    .object-chip.mutated-chip {
        background: rgba(251, 191, 36, 0.15);
        border: 1px solid rgba(251, 191, 36, 0.3);
    }

    .object-chip.deleted-chip {
        background: rgba(220, 38, 38, 0.15);
        border: 1px solid rgba(220, 38, 38, 0.3);
    }

    .object-chip.input-chip:hover {
        background: rgba(139, 92, 246, 0.25);
        border-color: rgba(139, 92, 246, 0.5);
    }

    .expand-btn {
        background: none;
        border: none;
        color: rgba(255, 255, 255, 0.7);
        padding: 0;
        font-size: 0.65rem;
        cursor: pointer;
        width: 14px;
        height: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .expand-btn:hover {
        color: rgba(255, 255, 255, 1);
    }

    .filter-obj-btn {
        background: none;
        border: none;
        padding: 0 0.2rem;
        font-size: 0.65rem;
        cursor: pointer;
        opacity: 0.7;
    }

    .filter-obj-btn:hover,
    .filter-obj-btn.active {
        opacity: 1;
    }

    .expanded-object {
        margin-left: 1rem;
        margin-top: 0.25rem;
        border-left: 2px solid rgba(59, 130, 246, 0.3);
        padding-left: 0.5rem;
    }

    .obj-type {
        color: rgba(16, 185, 129, 1);
        font-weight: 500;
    }

    .obj-id {
        font-family: 'JetBrains Mono', monospace;
        color: rgba(255, 255, 255, 0.7);
    }

    .connection-indicator {
        font-size: 0.65rem;
        color: rgba(251, 191, 36, 1);
    }

    .connection-line {
        position: absolute;
        left: 10px;
        top: 100%;
        width: 2px;
        height: 20px;
        background: rgba(251, 191, 36, 0.5);
    }

    /* Modal */
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.85);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        padding: 2rem;
        overflow: hidden;
    }

    .modal-content {
        background: rgb(22, 28, 39);
        max-width: 90vw;
        max-height: 90vh;
        overflow: auto;
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    }

    /* Active Filters */
    .active-filters {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background: rgba(59, 130, 246, 0.1);
        border: 1px solid rgba(59, 130, 246, 0.3);
        border-radius: 6px;
        margin-bottom: 1rem;
        flex-wrap: wrap;
    }

    .active-filters > span {
        color: rgba(255, 255, 255, 0.7);
        font-size: 0.85rem;
    }

    .filter-tag {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        padding: 0.25rem 0.5rem;
        background: rgba(59, 130, 246, 0.2);
        border: 1px solid rgba(59, 130, 246, 0.4);
        border-radius: 4px;
        font-size: 0.8rem;
        color: rgba(59, 130, 246, 1);
        font-family: 'JetBrains Mono', monospace;
    }

    .filter-remove {
        background: none;
        border: none;
        color: rgba(255, 255, 255, 0.7);
        padding: 0;
        font-size: 1rem;
        cursor: pointer;
        line-height: 1;
    }

    .filter-remove:hover {
        color: rgba(255, 255, 255, 1);
    }

    .clear-filters-btn {
        padding: 0.25rem 0.5rem;
        font-size: 0.8rem;
        background: rgba(220, 38, 38, 0.2);
        border: 1px solid rgba(220, 38, 38, 0.3);
        color: #fca5a5;
    }

    .clear-filters-btn:hover {
        background: rgba(220, 38, 38, 0.3);
    }

    @media (max-width: 768px) {
        .main-content {
            flex-direction: column;
        }

        .address-sidebar {
            width: 100%;
            max-height: 200px;
        }

        .timeline {
            padding-left: 60px;
        }

        .timeline::before {
            left: 40px;
        }

        .checkpoint-badge {
            font-size: 0.6rem;
            padding: 0.15rem 0.3rem;
        }

        .controls-row {
            flex-direction: column;
            align-items: stretch;
        }

        .fetch-size-control {
            justify-content: space-between;
        }
    }
</style>

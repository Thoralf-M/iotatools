// [MIGRATION] Primary client is now GraphQlClient from WASM SDK.
// Legacy IotaClient kept for operations the WASM SDK doesn't yet support
// (devInspect, dryRunTransactionBlock, signAndExecuteTransaction, getLatestIotaSystemState).
import { IotaClient } from '@iota/iota-sdk/client';
import { IotaClientGraphQLTransport } from '@iota/graphql-transport';
import { get } from 'svelte/store';

import type { NetworkConfig } from './default-client-config';
import { sharedClientConfig } from './local-storage-store';
import { getNetworkConfigOverride, hasNetworkConfigOverride } from './network-config';
import { GraphQlClient } from './wasm-sdk';

// Used to determine if the client should be initialized with a new node
let previousInitializedNodeUrl = '';
let regularClient: GraphQlClient | undefined = undefined;
let graphqlClient: GraphQlClient | undefined = undefined;

export function getClient(graphql: boolean = false): GraphQlClient {
    let networkConfig = getSelectedNetworkConfig();
    let selectedNetworkUrl = networkConfig.graphql;

    if (graphql) {
        if (graphqlClient == undefined || selectedNetworkUrl != previousInitializedNodeUrl) {
            graphqlClient = new GraphQlClient(networkConfig.graphql);
            previousInitializedNodeUrl = selectedNetworkUrl;
        }
        return graphqlClient;
    } else {
        if (regularClient == undefined || selectedNetworkUrl != previousInitializedNodeUrl) {
            regularClient = new GraphQlClient(selectedNetworkUrl);
            previousInitializedNodeUrl = selectedNetworkUrl;
        }
        return regularClient;
    }
}

export function getSelectedNetworkConfig(): NetworkConfig {
    // Check for override first (for scripts/tests running outside browser)
    if (hasNetworkConfigOverride()) {
        return getNetworkConfigOverride()!;
    }
    let config = get(sharedClientConfig);
    return config.networks.find((network) => network.name == config.selected)!;
}

// Legacy IotaClient for operations not yet supported by the WASM SDK
// (devInspect, dryRunTransactionBlock, signAndExecuteTransaction, getLatestIotaSystemState, etc.)
let legacyClient: IotaClient | undefined = undefined;
let previousLegacyNodeUrl = '';

export function getLegacyClient(): IotaClient {
    const networkConfig = getSelectedNetworkConfig();
    const url = networkConfig.graphql;
    if (legacyClient == undefined || url != previousLegacyNodeUrl) {
        legacyClient = new IotaClient({
            transport: new IotaClientGraphQLTransport({ url }),
        });
        previousLegacyNodeUrl = url;
    }
    return legacyClient;
}

export function getSelectedChain(): string {
    const networkConfig = getSelectedNetworkConfig();
    return `iota:${networkConfig.name}`;
}

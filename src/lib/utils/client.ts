// [GAP] @iota/graphql-transport not available in WASM SDK - GraphQlClient is natively GraphQL
// [MIGRATION] IotaClient → GraphQlClient, IotaClientOptions removed (GraphQlClient takes a URL string)
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
    let selectedNetworkUrl = networkConfig.node;

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

export function getSelectedChain(): string {
    const networkConfig = getSelectedNetworkConfig();
    return `iota:${networkConfig.name}`;
}

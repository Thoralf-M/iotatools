import { IotaClientGraphQLTransport } from '@iota/graphql-transport';
import { IotaClient, type IotaClientOptions } from '@iota/iota-sdk/client';
import { get } from 'svelte/store';

import type { NetworkConfig } from './default-client-config';
import { sharedClientConfig } from './local-storage-store';
import { getNetworkConfigOverride, hasNetworkConfigOverride } from './network-config';

// Used to determine if the client should be initialized with a new node
let previousInitializedNodeUrl = '';
let regularClient: IotaClient | undefined = undefined;
let graphqlClient: IotaClient | undefined = undefined;

export function getClient(graphql: boolean = false): IotaClient {
    let networkConfig = getSelectedNetworkConfig();
    let selectedNetworkUrl = networkConfig.node;
    
    if (graphql) {
        if (graphqlClient == undefined || selectedNetworkUrl != previousInitializedNodeUrl) {
            const clientOptions: IotaClientOptions = {
                transport: new IotaClientGraphQLTransport({
                    url: networkConfig.graphql,
                    fallbackTransportUrl: selectedNetworkUrl,
                }),
            };
            graphqlClient = new IotaClient(clientOptions);
            previousInitializedNodeUrl = selectedNetworkUrl;
        }
        return graphqlClient;
    } else {
        if (regularClient == undefined || selectedNetworkUrl != previousInitializedNodeUrl) {
            const clientOptions: IotaClientOptions = {
                url: selectedNetworkUrl,
            };
            regularClient = new IotaClient(clientOptions);
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

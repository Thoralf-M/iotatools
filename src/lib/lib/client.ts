import { IotaClientGraphQLTransport } from '@iota/graphql-transport';
import { IotaClient } from '@iota/iota-sdk/client';
import { get } from 'svelte/store';

import type { NetworkConfig } from './default-client-config';
import { sharedClientConfig } from './local-storage-store';

// Used to determine if the client should be initialized with a new node
let previousInitializedNodeUrl = '';
let client: any = undefined;
export function getClient(): IotaClient {
    let networkConfig = getSelectedNetworkConfig();
    let selectedNetworkUrl = networkConfig.node;
    if (client == undefined || selectedNetworkUrl != previousInitializedNodeUrl) {
        client = new IotaClient({
            transport: new IotaClientGraphQLTransport({
                url: networkConfig.graphql,
                fallbackTransportUrl: selectedNetworkUrl,
            }),
        });
        previousInitializedNodeUrl = selectedNetworkUrl;
    }
    return client;
}

export function getSelectedNetworkConfig(): NetworkConfig {
    let config = get(sharedClientConfig);
    return config.networks.find((network) => network.name == config.selected)!;
}

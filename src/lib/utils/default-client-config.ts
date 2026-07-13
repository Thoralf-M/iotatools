export interface NetworkConfig {
    name: string;
    node: string;
    indexer: string;
    graphql: string;
    explorer: string;
    faucet?: string;
}

export interface ClientConfig {
    selected: string;
    networks: NetworkConfig[];
}

export const defaultClientConfig: ClientConfig = {
    selected: 'mainnet',
    networks: [
        {
            name: 'mainnet',
            node: 'https://api.mainnet.iota.cafe',
            indexer: 'https://indexer.mainnet.iota.cafe',
            graphql: 'https://graphql.mainnet.iota.cafe',
            explorer: 'https://explorer.iota.org',
        },
        {
            name: 'localnet',
            node: 'http://127.0.0.1:9000',
            indexer: 'http://127.0.0.1:9124',
            graphql: 'http://127.0.0.1:9125',
            explorer: 'https://explorer.iota.org',
            faucet: 'http://127.0.0.1:9123',
        },
        {
            name: 'testnet',
            node: 'https://api.testnet.iota.cafe',
            indexer: 'https://indexer.testnet.iota.cafe',
            graphql: 'https://graphql.testnet.iota.cafe',
            explorer: 'https://explorer.iota.org',
            faucet: 'https://faucet.testnet.iota.cafe',
        },
        {
            name: 'devnet',
            node: 'https://api.devnet.iota.cafe',
            indexer: 'https://indexer.devnet.iota.cafe',
            graphql: 'https://graphql.devnet.iota.cafe',
            explorer: 'https://explorer.iota.org',
            faucet: 'https://faucet.devnet.iota.cafe',
        },
    ],
};

export function verifyClientConfig(value: any) {
    if (typeof value !== 'object' || value === null) throw new Error('Config is not an object');
    if (typeof value.selected !== 'string') throw new Error('Config.selected is not a string');
    if (!Array.isArray(value.networks)) throw new Error('Config.networks is not an array');
    for (const [i, network] of value.networks.entries()) {
        if (typeof network.name !== 'string')
            throw new Error(`Config.networks[${i}].name is not a string`);
        if (typeof network.node !== 'string')
            throw new Error(`Config.networks[${i}].node is not a string`);
        if (typeof network.indexer !== 'string')
            throw new Error(`Config.networks[${i}].indexer is not a string`);
        if (typeof network.graphql !== 'string')
            throw new Error(`Config.networks[${i}].graphql is not a string`);
        if (typeof network.explorer !== 'string')
            throw new Error(`Config.networks[${i}].explorer is not a string`);
        if (network.faucet && typeof network.faucet !== 'string')
            throw new Error(`Config.networks[${i}].faucet is not a string`);
    }
    return true;
}

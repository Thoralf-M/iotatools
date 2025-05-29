export interface NetworkConfig {
    name: string;
    node: string;
    indexer: string;
    graphql: string;
    faucet?: string;
}

export interface ClientConfig {
    selected: string;
    networks: NetworkConfig[];
}

export const defaultClientConfig: ClientConfig = {
    selected: 'testnet',
    networks: [
        {
            name: 'mainnet',
            node: 'https://api.mainnet.iota.cafe',
            indexer: 'https://indexer.mainnet.iota.cafe',
            graphql: 'https://graphql.mainnet.iota.cafe',
        },
        {
            name: 'localnet',
            node: 'http://127.0.0.1:9000',
            indexer: 'http://127.0.0.1:9124',
            graphql: 'http://127.0.0.1:9125',
            faucet: 'http://127.0.0.1:9123/gas',
        },
        {
            name: 'testnet',
            node: 'https://api.testnet.iota.cafe',
            indexer: 'https://indexer.testnet.iota.cafe',
            graphql: 'https://graphql.testnet.iota.cafe',
            faucet: 'https://faucet.testnet.iota.cafe/gas',
        },
        {
            name: 'devnet',
            node: 'https://api.devnet.iota.cafe',
            indexer: 'https://indexer.devnet.iota.cafe',
            graphql: 'https://graphql.devnet.iota.cafe',
            faucet: 'https://faucet.devnet.iota.cafe/gas',
        },
        {
            name: 'alphanet',
            node: 'https://indexer.iota-rebased-alphanet.iota.cafe',
            indexer: 'https://indexer.iota-rebased-alphanet.iota.cafe',
            graphql: 'https://graphql.iota-rebased-alphanet.iota.cafe',
            faucet: 'https://faucet.iota-rebased-alphanet.iota.cafe/gas',
        },
    ],
};

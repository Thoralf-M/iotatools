/**
 * Network configuration module that works both in browser (with Svelte stores)
 * and in Node.js scripts.
 *
 * This module provides a way to get/set the network configuration without
 * depending on browser-specific APIs like localStorage.
 */

import type { NetworkConfig } from './default-client-config';
import { defaultClientConfig } from './default-client-config';

// Global network config that can be set programmatically
let _overrideNetworkConfig: NetworkConfig | null = null;

/**
 * Set a network configuration override.
 * This is useful for scripts and tests that need to run without browser APIs.
 *
 * @param config The network config to use, or null to clear the override
 */
export function setNetworkConfigOverride(config: NetworkConfig | null): void {
    _overrideNetworkConfig = config;
}

/**
 * Get the current network configuration override.
 * Returns null if no override is set.
 */
export function getNetworkConfigOverride(): NetworkConfig | null {
    return _overrideNetworkConfig;
}

/**
 * Check if a network config override is set.
 */
export function hasNetworkConfigOverride(): boolean {
    return _overrideNetworkConfig !== null;
}

/**
 * Get a network config by name from the default configs.
 */
export function getNetworkConfigByName(name: string): NetworkConfig | undefined {
    return defaultClientConfig.networks.find((n) => n.name === name);
}

/**
 * Mainnet configuration for convenience
 */
export const MAINNET_CONFIG: NetworkConfig = {
    name: 'mainnet',
    node: 'https://api.mainnet.iota.cafe',
    indexer: 'https://indexer.mainnet.iota.cafe',
    graphql: 'https://graphql.mainnet.iota.cafe',
    explorer: 'https://explorer.iota.org',
};

/**
 * Testnet configuration for convenience
 */
export const TESTNET_CONFIG: NetworkConfig = {
    name: 'testnet',
    node: 'https://api.testnet.iota.cafe',
    indexer: 'https://indexer.testnet.iota.cafe',
    graphql: 'https://graphql.testnet.iota.cafe',
    explorer: 'https://explorer.iota.org',
    faucet: 'https://faucet.testnet.iota.cafe/gas',
};

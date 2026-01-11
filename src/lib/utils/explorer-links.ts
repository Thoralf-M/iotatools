import type { NetworkConfig } from './default-client-config';

/**
 * Generate explorer links for different types of blockchain entities
 */
export function generateExplorerLink(
    network: NetworkConfig,
    type: 'txBlock' | 'object' | 'address',
    id: string,
): string {
    const networkParam = encodeURIComponent(network.indexer);
    return `${network.explorer}/${type}/${id}?network=${networkParam}`;
}

/**
 * Generate a transaction block explorer link
 */
export function getTransactionLink(network: NetworkConfig, txId: string): string {
    return generateExplorerLink(network, 'txBlock', txId);
}

/**
 * Generate an object explorer link
 */
export function getObjectLink(network: NetworkConfig, objectId: string): string {
    return generateExplorerLink(network, 'object', objectId);
}

/**
 * Generate an address explorer link
 */
export function getAddressLink(network: NetworkConfig, address: string): string {
    return generateExplorerLink(network, 'address', address);
}

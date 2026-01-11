import { derived, writable } from 'svelte/store';

import type { ClientConfig } from './default-client-config';
import { sharedClientConfig, sharedSignerType, SignerType } from './local-storage-store';
import { queryParams } from './query-params';

// Query parameter keys
export const QUERY_PARAM_KEYS = {
    NETWORK: 'network',
    SIGNER: 'signer',
    EXTERNAL_ADDRESS: 'externalAddress',
    // Add more global query param keys here as needed
} as const;

// List of global query parameters that should persist across page navigation
export const GLOBAL_QUERY_PARAMS = [
    QUERY_PARAM_KEYS.NETWORK,
    QUERY_PARAM_KEYS.SIGNER,
    QUERY_PARAM_KEYS.EXTERNAL_ADDRESS,
] as const;

// Store for tracking if we should use query param network selection
const useQueryParamNetwork = writable(false);

// Store for tracking if we should use query param signer selection
const useQueryParamSigner = writable(false);

// Derived store that gets the network from query params
const networkFromQuery = derived(queryParams, ($params) => {
    const network = $params[QUERY_PARAM_KEYS.NETWORK];
    return Array.isArray(network) ? network[0] : network;
});

// Derived store that gets the signer from query params
const signerFromQuery = derived(queryParams, ($params) => {
    const signer = $params[QUERY_PARAM_KEYS.SIGNER];
    return Array.isArray(signer) ? signer[0] : signer;
});

// Derived store that gets the address from query params
const addressFromQuery = derived(queryParams, ($params) => {
    const address = $params[QUERY_PARAM_KEYS.EXTERNAL_ADDRESS];
    return Array.isArray(address) ? address[0] : address;
});

// Enhanced client config that responds to query parameters
export const queryAwareClientConfig = derived(
    [sharedClientConfig, networkFromQuery, useQueryParamNetwork],
    ([$config, $networkQuery, $useQueryParam]) => {
        // If there's a network query param and it exists in the config, use it
        if ($networkQuery && $config.networks.some((n) => n.name === $networkQuery)) {
            const newConfig: ClientConfig = {
                ...$config,
                selected: $networkQuery,
            };

            // Update the underlying config if we haven't already
            if (!$useQueryParam) {
                useQueryParamNetwork.set(true);
                // Don't update sharedClientConfig to avoid infinite loop
                // Just return the modified config
            }

            return newConfig;
        }

        // Reset the flag if there's no valid network query param
        if (!$networkQuery && $useQueryParam) {
            useQueryParamNetwork.set(false);
        }

        return $config;
    },
);

// Function to initialize query parameter handling
export function initQueryParamHandling() {
    // Subscribe to network changes from query params
    networkFromQuery.subscribe((networkName) => {
        if (networkName) {
            sharedClientConfig.update((config) => {
                // Only update if the network exists and is different
                if (
                    config.networks.some((n) => n.name === networkName) &&
                    config.selected !== networkName
                ) {
                    return {
                        ...config,
                        selected: networkName,
                    };
                }
                return config;
            });
        }
    });

    // Subscribe to signer changes from query params
    signerFromQuery.subscribe((signerName) => {
        if (signerName && Object.values(SignerType).includes(signerName as SignerType)) {
            sharedSignerType.update((currentSigner) => {
                // Only update if the signer is different
                if (currentSigner !== signerName) {
                    useQueryParamSigner.set(true);
                    return signerName as SignerType;
                }
                return currentSigner;
            });
        }
    });
}

// Utility function to get a query parameter value for individual pages
export function useQueryParam(key: string) {
    return derived(queryParams, ($params) => {
        const value = $params[key];
        return Array.isArray(value) ? value[0] : value;
    });
}

// Utility function to get multiple values for a query parameter
export function useQueryParamArray(key: string) {
    return derived(queryParams, ($params) => {
        const value = $params[key];
        if (Array.isArray(value)) {
            return value;
        } else if (value) {
            return [value];
        } else {
            return [];
        }
    });
}

// Export the address query parameter store for use in components
export { addressFromQuery };

/**
 * Navigate to a route while preserving global query parameters
 * and clearing page-specific parameters
 */
export function navigateWithGlobalParams(route: string) {
    if (typeof window === 'undefined') return;

    const currentParams = getCurrentQueryParams();
    const globalParams = new URLSearchParams();

    // Preserve only global parameters
    for (const globalKey of GLOBAL_QUERY_PARAMS) {
        const value = currentParams[globalKey];
        if (value) {
            const paramValue = Array.isArray(value) ? value[0] : value;
            globalParams.set(globalKey, paramValue);
        }
    }

    // Construct new hash with preserved global params
    const newHash = globalParams.toString() ? `#${route}?${globalParams.toString()}` : `#${route}`;

    window.location.hash = newHash;
}

/**
 * Get current query parameters from URL
 */
function getCurrentQueryParams(): Record<string, string | string[]> {
    if (typeof window === 'undefined') return {};

    const params: Record<string, string | string[]> = {};
    let searchParams: URLSearchParams;

    const hash = window.location.hash;
    if (hash && hash.includes('?')) {
        const queryString = hash.split('?')[1];
        searchParams = new URLSearchParams(queryString);
    } else {
        searchParams = new URLSearchParams(window.location.search);
    }

    for (const [key, value] of searchParams.entries()) {
        if (params[key]) {
            if (Array.isArray(params[key])) {
                (params[key] as string[]).push(value);
            } else {
                params[key] = [params[key] as string, value];
            }
        } else {
            params[key] = value;
        }
    }

    return params;
}

export function setQueryParam(key: string, value: string | null) {
    if (typeof window === 'undefined') return;

    let url: URL;
    const hash = window.location.hash;

    if (hash && hash.startsWith('#/')) {
        // Hash-based routing: handle #/route?params
        const [route, currentParams] = hash.split('?');
        const searchParams = new URLSearchParams(currentParams || '');

        if (value === null) {
            searchParams.delete(key);
        } else {
            searchParams.set(key, value);
        }

        const newHash = searchParams.toString() ? `${route}?${searchParams.toString()}` : route;

        window.location.hash = newHash;
    } else {
        // Fallback to regular query parameters
        url = new URL(window.location.href);

        if (value === null) {
            url.searchParams.delete(key);
        } else {
            url.searchParams.set(key, value);
        }

        window.history.replaceState({}, '', url.toString());
    }
}

import { derived, writable, type Readable, type Writable } from 'svelte/store';

export interface QueryParams {
    [key: string]: string | string[] | undefined;
}

// Internal store to track query parameters
const _queryParams: Writable<QueryParams> = writable({});

// Function to parse query parameters from URL (supporting hash-based routing)
function parseQueryParams(): QueryParams {
    if (typeof window === 'undefined') return {};

    const params: QueryParams = {};
    let searchParams: URLSearchParams;

    // Check if we have hash-based routing with query parameters
    const hash = window.location.hash;
    if (hash && hash.includes('?')) {
        // Extract query string from hash: #/route?param=value
        const queryString = hash.split('?')[1];
        searchParams = new URLSearchParams(queryString);
    } else {
        // Fallback to regular query parameters
        searchParams = new URLSearchParams(window.location.search);
    }

    for (const [key, value] of searchParams.entries()) {
        if (params[key]) {
            // Handle multiple values for the same key
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

// Initialize query params and listen for changes
function initQueryParams() {
    if (typeof window === 'undefined') return;

    // Initial parse
    _queryParams.set(parseQueryParams());

    // Listen for popstate events (back/forward button)
    window.addEventListener('popstate', () => {
        _queryParams.set(parseQueryParams());
    });

    // Listen for hash changes (SPA router navigation)
    window.addEventListener('hashchange', () => {
        _queryParams.set(parseQueryParams());
    });

    // Listen for pushstate/replacestate (programmatic navigation)
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (...args) {
        originalPushState.apply(history, args);
        _queryParams.set(parseQueryParams());
    };

    history.replaceState = function (...args) {
        originalReplaceState.apply(history, args);
        _queryParams.set(parseQueryParams());
    };
}

// Initialize on first import
initQueryParams();

// Public readonly store
export const queryParams: Readable<QueryParams> = _queryParams;

// Utility function to get all values for a query parameter (useful for multi-value params)
export function getQueryParamValues(key: string): Readable<string[]> {
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

// Utility function to check if a query parameter exists
export function hasQueryParam(key: string): Readable<boolean> {
    return derived(queryParams, ($params) => key in $params);
}

// Utility function to update URL with new query parameters (client-side only)
export function updateQueryParams(newParams: Record<string, string | null>) {
    if (typeof window === 'undefined') return;

    const url = new URL(window.location.href);

    for (const [key, value] of Object.entries(newParams)) {
        if (value === null) {
            url.searchParams.delete(key);
        } else {
            url.searchParams.set(key, value);
        }
    }

    window.history.replaceState({}, '', url.toString());
}

// Get current URL parameters as a simple object (for SSR-safe usage)
export function getCurrentQueryParams(): QueryParams {
    if (typeof window === 'undefined') return {};

    const params: QueryParams = {};
    let searchParams: URLSearchParams;

    // Check if we have hash-based routing with query parameters
    const hash = window.location.hash;
    if (hash && hash.includes('?')) {
        // Extract query string from hash: #/route?param=value
        const queryString = hash.split('?')[1];
        searchParams = new URLSearchParams(queryString);
    } else {
        // Fallback to regular query parameters
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

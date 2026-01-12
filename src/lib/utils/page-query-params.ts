import { derived } from 'svelte/store';

import { queryParams } from './query-params';

/**
 * Hook for individual pages to bind form fields to query parameters
 * This allows URLs like: /page?field1=value1&field2=value2
 */
export function usePageQueryParams<T extends Record<string, any>>(
    defaultValues: T,
    fieldMappings?: Partial<Record<keyof T, string>>,
) {
    return derived(queryParams, ($params) => {
        const result = { ...defaultValues };

        for (const [fieldKey, defaultValue] of Object.entries(defaultValues)) {
            // Use custom mapping if provided, otherwise use field key as query param name
            const queryKey = fieldMappings?.[fieldKey as keyof T] || fieldKey;
            const queryValue = $params[queryKey];

            if (queryValue !== undefined) {
                const value = Array.isArray(queryValue) ? queryValue[0] : queryValue;

                // Type conversion based on default value type
                if (typeof defaultValue === 'boolean') {
                    result[fieldKey as keyof T] = (value === 'true' || value === '1') as T[keyof T];
                } else if (typeof defaultValue === 'number') {
                    const num = Number(value);
                    if (!isNaN(num)) {
                        result[fieldKey as keyof T] = num as T[keyof T];
                    }
                } else {
                    result[fieldKey as keyof T] = value as T[keyof T];
                }
            }
        }

        return result;
    });
}

/**
 * Hook to bind a single form field to a query parameter
 */
export function useQueryParamField(
    queryKey: string,
    defaultValue: string = '',
    type: 'string' | 'number' | 'boolean' = 'string',
) {
    return derived(queryParams, ($params) => {
        const queryValue = $params[queryKey];
        const value = Array.isArray(queryValue) ? queryValue[0] : queryValue;

        if (value === undefined) {
            return defaultValue;
        }

        switch (type) {
            case 'boolean':
                return value === 'true' || value === '1';
            case 'number':
                const num = Number(value);
                return isNaN(num) ? defaultValue : num;
            default:
                return value;
        }
    });
}

/**
 * Update URL query parameters for a page (useful for form updates)
 */
export function updatePageQueryParams(updates: Record<string, string | number | boolean | null>) {
    if (typeof window === 'undefined') return;

    const hash = window.location.hash;

    if (hash && hash.startsWith('#/')) {
        // Hash-based routing: handle #/route?params
        const [route, currentParams] = hash.split('?');
        const searchParams = new URLSearchParams(currentParams || '');

        for (const [key, value] of Object.entries(updates)) {
            if (value === null || value === undefined) {
                searchParams.delete(key);
            } else {
                searchParams.set(key, String(value));
            }
        }

        const newHash = searchParams.toString() ? `${route}?${searchParams.toString()}` : route;

        window.location.hash = newHash;
    } else {
        // Fallback to regular query parameters
        const url = new URL(window.location.href);

        for (const [key, value] of Object.entries(updates)) {
            if (value === null || value === undefined) {
                url.searchParams.delete(key);
            } else {
                url.searchParams.set(key, String(value));
            }
        }

        window.history.replaceState({}, '', url.toString());
    }
}

/**
 * Clear specific query parameters
 */
export function clearQueryParams(keys: string[]) {
    if (typeof window === 'undefined') return;

    const hash = window.location.hash;

    if (hash && hash.startsWith('#/')) {
        // Hash-based routing: handle #/route?params
        const [route, currentParams] = hash.split('?');
        const searchParams = new URLSearchParams(currentParams || '');

        for (const key of keys) {
            searchParams.delete(key);
        }

        const newHash = searchParams.toString() ? `${route}?${searchParams.toString()}` : route;

        window.location.hash = newHash;
    } else {
        // Fallback to regular query parameters
        const url = new URL(window.location.href);

        for (const key of keys) {
            url.searchParams.delete(key);
        }

        window.history.replaceState({}, '', url.toString());
    }
}

/**
 * Get all current query parameters as an object
 */
export function getCurrentPageQueryParams(): Record<string, string> {
    if (typeof window === 'undefined') return {};

    const params: Record<string, string> = {};
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
        params[key] = value;
    }

    return params;
}

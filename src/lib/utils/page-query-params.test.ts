/**
 * Tests for page query params utilities
 */

import { describe, expect, it, beforeEach } from 'vitest';

import {
    clearQueryParams,
    getCurrentPageQueryParams,
    updatePageQueryParams,
} from './page-query-params';

describe('updatePageQueryParams', () => {
    beforeEach(() => {
        // Reset to a known hash-based route
        window.location.hash = '#/test-page';
    });

    it('should add query parameters to hash-based route', () => {
        updatePageQueryParams({ foo: 'bar' });
        expect(window.location.hash).toContain('foo=bar');
    });

    it('should update existing query parameters', () => {
        window.location.hash = '#/test-page?foo=old';
        updatePageQueryParams({ foo: 'new' });
        expect(window.location.hash).toContain('foo=new');
        expect(window.location.hash).not.toContain('foo=old');
    });

    it('should remove query parameters when set to null', () => {
        window.location.hash = '#/test-page?foo=bar&baz=qux';
        updatePageQueryParams({ foo: null });
        expect(window.location.hash).not.toContain('foo=');
        expect(window.location.hash).toContain('baz=qux');
    });

    it('should handle multiple parameters at once', () => {
        updatePageQueryParams({ a: '1', b: '2', c: '3' });
        const hash = window.location.hash;
        expect(hash).toContain('a=1');
        expect(hash).toContain('b=2');
        expect(hash).toContain('c=3');
    });

    it('should preserve the route path', () => {
        updatePageQueryParams({ param: 'value' });
        expect(window.location.hash).toMatch(/^#\/test-page\?/);
    });
});

describe('clearQueryParams', () => {
    beforeEach(() => {
        window.location.hash = '#/page?foo=1&bar=2&baz=3';
    });

    it('should clear specified query parameters', () => {
        clearQueryParams(['foo', 'bar']);
        expect(window.location.hash).not.toContain('foo=');
        expect(window.location.hash).not.toContain('bar=');
        expect(window.location.hash).toContain('baz=3');
    });

    it('should handle clearing all params', () => {
        clearQueryParams(['foo', 'bar', 'baz']);
        // Should just have the route without query string
        expect(window.location.hash).toBe('#/page');
    });
});

describe('getCurrentPageQueryParams', () => {
    it('should return empty object when no params', () => {
        window.location.hash = '#/page';
        const params = getCurrentPageQueryParams();
        expect(params).toEqual({});
    });

    it('should return current parameters from hash route', () => {
        window.location.hash = '#/page?key1=value1&key2=value2';
        const params = getCurrentPageQueryParams();
        expect(params.key1).toBe('value1');
        expect(params.key2).toBe('value2');
    });
});

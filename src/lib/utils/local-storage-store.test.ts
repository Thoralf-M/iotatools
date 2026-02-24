/**
 * Tests for localStorage-backed persistent stores
 */

import { get } from 'svelte/store';
import { describe, expect, it } from 'vitest';

import { persistentWritableStore } from './local-storage-store';

describe('persistentWritableStore', () => {
    it('should initialize with default value when localStorage is empty', () => {
        const store = persistentWritableStore(
            'test-key-1',
            'default',
            (v: any) => typeof v === 'string',
        );
        expect(get(store)).toBe('default');
    });

    it('should persist value to localStorage on update', () => {
        const store = persistentWritableStore(
            'test-key-2',
            'initial',
            (v: any) => typeof v === 'string',
        );
        store.set('updated');
        expect(get(store)).toBe('updated');
        expect(localStorage.getItem('test-key-2')).toBe('"updated"');
    });

    it('should load existing value from localStorage', () => {
        localStorage.setItem('test-key-3', '"stored-value"');
        const store = persistentWritableStore(
            'test-key-3',
            'default',
            (v: any) => typeof v === 'string',
        );
        expect(get(store)).toBe('stored-value');
    });

    it('should fall back to default when localStorage has invalid JSON', () => {
        localStorage.setItem('test-key-4', 'not-valid-json');
        const store = persistentWritableStore(
            'test-key-4',
            'fallback',
            (v: any) => typeof v === 'string',
        );
        expect(get(store)).toBe('fallback');
    });

    it('should fall back to default when verification fails', () => {
        localStorage.setItem('test-key-5', '42');
        const store = persistentWritableStore('test-key-5', 'fallback', (v: any) => {
            if (typeof v !== 'string') throw new Error('must be string');
            return true;
        });
        expect(get(store)).toBe('fallback');
    });

    it('should handle boolean values', () => {
        const store = persistentWritableStore(
            'test-bool',
            false,
            (v: any) => typeof v === 'boolean',
        );
        expect(get(store)).toBe(false);
        store.set(true);
        expect(get(store)).toBe(true);
        expect(localStorage.getItem('test-bool')).toBe('true');
    });

    it('should handle object values', () => {
        const defaultObj = { name: 'test', count: 0 };
        const store = persistentWritableStore(
            'test-obj',
            defaultObj,
            (v: any) => typeof v === 'object',
        );
        expect(get(store)).toEqual(defaultObj);

        store.set({ name: 'updated', count: 5 });
        expect(get(store)).toEqual({ name: 'updated', count: 5 });
    });
});

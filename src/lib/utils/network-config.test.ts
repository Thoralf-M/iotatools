/**
 * Tests for network configuration module
 */

import { afterEach, describe, expect, it } from 'vitest';

import {
    getNetworkConfigByName,
    getNetworkConfigOverride,
    hasNetworkConfigOverride,
    MAINNET_CONFIG,
    setNetworkConfigOverride,
    TESTNET_CONFIG,
} from './network-config';

describe('Network Config Override', () => {
    afterEach(() => {
        // Clean up override after each test
        setNetworkConfigOverride(null);
    });

    it('should initially have no override', () => {
        expect(hasNetworkConfigOverride()).toBe(false);
        expect(getNetworkConfigOverride()).toBeNull();
    });

    it('should set and get an override', () => {
        setNetworkConfigOverride(MAINNET_CONFIG);
        expect(hasNetworkConfigOverride()).toBe(true);
        expect(getNetworkConfigOverride()).toEqual(MAINNET_CONFIG);
    });

    it('should clear the override when set to null', () => {
        setNetworkConfigOverride(MAINNET_CONFIG);
        expect(hasNetworkConfigOverride()).toBe(true);

        setNetworkConfigOverride(null);
        expect(hasNetworkConfigOverride()).toBe(false);
        expect(getNetworkConfigOverride()).toBeNull();
    });
});

describe('MAINNET_CONFIG', () => {
    it('should have correct name', () => {
        expect(MAINNET_CONFIG.name).toBe('mainnet');
    });

    it('should have all required URLs', () => {
        expect(MAINNET_CONFIG.node).toContain('mainnet');
        expect(MAINNET_CONFIG.indexer).toContain('mainnet');
        expect(MAINNET_CONFIG.graphql).toContain('mainnet');
        expect(MAINNET_CONFIG.explorer).toBeTruthy();
    });

    it('should not have a faucet', () => {
        expect(MAINNET_CONFIG.faucet).toBeUndefined();
    });
});

describe('TESTNET_CONFIG', () => {
    it('should have correct name', () => {
        expect(TESTNET_CONFIG.name).toBe('testnet');
    });

    it('should have a faucet URL', () => {
        expect(TESTNET_CONFIG.faucet).toContain('faucet');
        expect(TESTNET_CONFIG.faucet).toContain('testnet');
    });
});

describe('getNetworkConfigByName', () => {
    it('should return mainnet config by name', () => {
        const config = getNetworkConfigByName('mainnet');
        expect(config).toBeDefined();
        expect(config?.name).toBe('mainnet');
    });

    it('should return testnet config by name', () => {
        const config = getNetworkConfigByName('testnet');
        expect(config).toBeDefined();
        expect(config?.name).toBe('testnet');
    });

    it('should return undefined for unknown network', () => {
        const config = getNetworkConfigByName('nonexistent');
        expect(config).toBeUndefined();
    });
});

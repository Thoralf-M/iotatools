/**
 * Tests for default client configuration
 */

import { describe, expect, it } from 'vitest';

import { defaultClientConfig, verifyClientConfig } from './default-client-config';

describe('defaultClientConfig', () => {
    it('should have a selected network', () => {
        expect(defaultClientConfig.selected).toBe('testnet');
    });

    it('should have multiple networks configured', () => {
        expect(defaultClientConfig.networks.length).toBeGreaterThanOrEqual(3);
    });

    it('should include mainnet, testnet, and devnet', () => {
        const names = defaultClientConfig.networks.map((n) => n.name);
        expect(names).toContain('mainnet');
        expect(names).toContain('testnet');
        expect(names).toContain('devnet');
    });

    it('each network should have required fields', () => {
        for (const network of defaultClientConfig.networks) {
            expect(network.name).toBeTruthy();
            expect(network.node).toBeTruthy();
            expect(network.indexer).toBeTruthy();
            expect(network.graphql).toBeTruthy();
            expect(network.explorer).toBeTruthy();
        }
    });

    it('testnet and devnet should have faucet URLs', () => {
        const testnet = defaultClientConfig.networks.find((n) => n.name === 'testnet');
        const devnet = defaultClientConfig.networks.find((n) => n.name === 'devnet');
        expect(testnet?.faucet).toBeTruthy();
        expect(devnet?.faucet).toBeTruthy();
    });

    it('mainnet should NOT have a faucet URL', () => {
        const mainnet = defaultClientConfig.networks.find((n) => n.name === 'mainnet');
        expect(mainnet?.faucet).toBeUndefined();
    });
});

describe('verifyClientConfig', () => {
    it('should accept valid config', () => {
        expect(verifyClientConfig(defaultClientConfig)).toBe(true);
    });

    it('should throw for non-object config', () => {
        expect(() => verifyClientConfig(null)).toThrow();
        expect(() => verifyClientConfig('string')).toThrow();
        expect(() => verifyClientConfig(42)).toThrow();
    });

    it('should throw for missing selected field', () => {
        expect(() =>
            verifyClientConfig({
                networks: [],
            }),
        ).toThrow('Config.selected is not a string');
    });

    it('should throw for missing networks array', () => {
        expect(() =>
            verifyClientConfig({
                selected: 'test',
            }),
        ).toThrow('Config.networks is not an array');
    });

    it('should throw for invalid network entries', () => {
        expect(() =>
            verifyClientConfig({
                selected: 'test',
                networks: [{ name: 123, node: 'x', indexer: 'x', graphql: 'x', explorer: 'x' }],
            }),
        ).toThrow();
    });

    it('should throw for missing required network fields', () => {
        expect(() =>
            verifyClientConfig({
                selected: 'test',
                networks: [{ name: 'test' }],
            }),
        ).toThrow();
    });

    it('should accept networks without optional faucet', () => {
        const config = {
            selected: 'main',
            networks: [
                {
                    name: 'main',
                    node: 'http://node',
                    indexer: 'http://indexer',
                    graphql: 'http://graphql',
                    explorer: 'http://explorer',
                },
            ],
        };
        expect(verifyClientConfig(config)).toBe(true);
    });
});

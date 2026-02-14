/**
 * Tests for explorer link generation utilities
 */

import { describe, expect, it } from 'vitest';

import type { NetworkConfig } from './default-client-config';
import {
    generateExplorerLink,
    getAddressLink,
    getObjectLink,
    getTransactionLink,
} from './explorer-links';

const mockNetwork: NetworkConfig = {
    name: 'testnet',
    node: 'https://api.testnet.iota.cafe',
    indexer: 'https://indexer.testnet.iota.cafe',
    graphql: 'https://graphql.testnet.iota.cafe',
    explorer: 'https://explorer.iota.org',
    faucet: 'https://faucet.testnet.iota.cafe/gas',
};

describe('generateExplorerLink', () => {
    it('should generate a transaction block link', () => {
        const link = generateExplorerLink(mockNetwork, 'txBlock', 'ABC123');
        expect(link).toBe(
            'https://explorer.iota.org/txBlock/ABC123?network=https%3A%2F%2Findexer.testnet.iota.cafe',
        );
    });

    it('should generate an object link', () => {
        const link = generateExplorerLink(mockNetwork, 'object', '0xdef456');
        expect(link).toContain('/object/0xdef456');
        expect(link).toContain('network=');
    });

    it('should generate an address link', () => {
        const link = generateExplorerLink(mockNetwork, 'address', '0xabc');
        expect(link).toContain('/address/0xabc');
    });

    it('should URL-encode the indexer parameter', () => {
        const link = generateExplorerLink(mockNetwork, 'txBlock', 'tx1');
        expect(link).toContain('network=https%3A%2F%2Findexer.testnet.iota.cafe');
    });
});

describe('getTransactionLink', () => {
    it('should return a valid transaction explorer URL', () => {
        const link = getTransactionLink(mockNetwork, 'myTxDigest');
        expect(link).toContain('/txBlock/myTxDigest');
        expect(link.startsWith('https://explorer.iota.org')).toBe(true);
    });
});

describe('getObjectLink', () => {
    it('should return a valid object explorer URL', () => {
        const link = getObjectLink(mockNetwork, '0xobject123');
        expect(link).toContain('/object/0xobject123');
    });
});

describe('getAddressLink', () => {
    it('should return a valid address explorer URL', () => {
        const link = getAddressLink(mockNetwork, '0xaddr456');
        expect(link).toContain('/address/0xaddr456');
    });
});

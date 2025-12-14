/**
 * Tests for transaction-view utility functions
 */

import { describe, it, expect } from 'vitest';
import {
    removeKindFields,
    normalizeOwner,
    isTransactionData,
    getTransactionData,
} from './transaction-view';
import { readFileSync } from 'fs';
import { join } from 'path';
import { fromBase64 } from '@iota/bcs';

// Load fixtures
const graphqlTx = JSON.parse(
    readFileSync(join(__dirname, 'tx-fixtures/graphql-tx.json'), 'utf-8'),
);
const jsonRpcTx = JSON.parse(
    readFileSync(join(__dirname, 'tx-fixtures/json-rpc-tx.json'), 'utf-8'),
);
const signedTxBase64 = readFileSync(
    join(__dirname, 'tx-fixtures/signed-tx.txt'),
    'utf-8',
).trim();
const unsignedTxBase64 = readFileSync(
    join(__dirname, 'tx-fixtures/unsigned-tx.txt'),
    'utf-8',
).trim();

describe('removeKindFields', () => {
    it('should remove $kind fields from objects', () => {
        const obj = {
            $kind: 'test',
            name: 'value',
            nested: {
                $kind: 'nested',
                value: 123,
            },
        };
        const cleaned = removeKindFields(obj);
        expect(cleaned).toEqual({
            name: 'value',
            nested: {
                value: 123,
            },
        });
    });

    it('should handle arrays', () => {
        const arr = [
            { $kind: 'a', value: 1 },
            { $kind: 'b', value: 2 },
        ];
        const cleaned = removeKindFields(arr);
        expect(cleaned).toEqual([{ value: 1 }, { value: 2 }]);
    });

    it('should handle null and undefined', () => {
        expect(removeKindFields(null)).toBe(null);
        expect(removeKindFields(undefined)).toBe(undefined);
    });

    it('should handle primitives', () => {
        expect(removeKindFields('string')).toBe('string');
        expect(removeKindFields(123)).toBe(123);
        expect(removeKindFields(true)).toBe(true);
    });
});

describe('normalizeOwner', () => {
    it('should return string owners as-is', () => {
        expect(normalizeOwner('0x123')).toBe('0x123');
    });

    it('should extract AddressOwner', () => {
        expect(normalizeOwner({ AddressOwner: '0xabc' })).toBe('0xabc');
    });

    it('should format ObjectOwner', () => {
        expect(normalizeOwner({ ObjectOwner: '0xdef' })).toBe('Object 0xdef');
    });

    it('should handle Shared', () => {
        expect(normalizeOwner({ Shared: {} })).toBe('Shared');
    });

    it('should handle Immutable', () => {
        expect(normalizeOwner({ Immutable: true })).toBe('Immutable');
    });

    it('should return null for falsy values', () => {
        expect(normalizeOwner(null)).toBe(null);
        expect(normalizeOwner(undefined)).toBe(null);
    });
});

describe('isTransactionData', () => {
    it('should detect raw transaction data format', () => {
        const rawTx = {
            sender: '0x123',
            inputs: [],
            commands: [],
            gasData: {},
        };
        expect(isTransactionData(rawTx)).toBe(true);
    });

    it('should detect signed transaction format', () => {
        const signedTx = {
            intentMessage: {
                value: { V1: {} },
            },
            txSignatures: [],
        };
        expect(isTransactionData(signedTx)).toBe(true);
    });

    it('should detect direct transaction format with effects', () => {
        expect(isTransactionData({ digest: '123', effects: {} })).toBe(true);
        expect(isTransactionData({ decodedBCS: {} })).toBe(true);
        expect(isTransactionData({ sender: '0x123', timestamp: 123 })).toBe(true);
    });

    it('should detect JSON-RPC response format', () => {
        const jsonRpc = {
            jsonrpc: '2.0',
            result: {
                effects: {},
            },
        };
        expect(isTransactionData(jsonRpc)).toBe(true);
    });

    it('should detect dev inspect JSON-RPC format', () => {
        const devInspect = {
            jsonrpc: '2.0',
            result: {
                effects: {},
                results: [],
            },
        };
        expect(isTransactionData(devInspect)).toBe(true);
    });

    it('should detect GraphQL response format with checkpoint/timestampMs', () => {
        const graphql = {
            digest: '123',
            sender: '0xabc',
            checkpoint: 12345,
            timestampMs: 1000000,
            effects: {
                objectChanges: {
                    nodes: [],
                },
            },
        };
        expect(isTransactionData(graphql)).toBe(true);
    });

    it('should return false for non-transaction data', () => {
        expect(isTransactionData(null)).toBe(false);
        expect(isTransactionData({})).toBe(false);
        expect(isTransactionData({ random: 'data' })).toBe(false);
    });
});

describe('getTransactionData - GraphQL format', () => {
    it('should handle GraphQL transaction with checkpoint and timestampMs', () => {
        const graphqlData = {
            digest: 'TestDigest123',
            sender: { address: '0xsender123' },
            checkpoint: 152235146,
            timestampMs: 1765740660238,
            effects: {
                status: 'success',
                executedEpoch: 100,
                gasEffects: {
                    gasSummary: {
                        computationCost: '1000',
                        storageCost: '500',
                    },
                },
                balanceChanges: { nodes: [] },
                objectChanges: { nodes: [] },
                events: { nodes: [] },
            },
        };

        const normalized = getTransactionData(graphqlData);

        expect(normalized.digest).toBe('TestDigest123');
        expect(normalized.sender).toBe('0xsender123');
        expect(normalized.timestamp).toBe(1765740660238);
        expect(normalized.effects.checkpoint.sequenceNumber).toBe(152235146);
        expect(normalized.effects.checkpoint.timestamp).toBe(1765740660238);
        expect(normalized.effects.executedEpoch).toBe(100);
        expect(normalized.effects.status.status).toBe('success');
    });

    it('should handle GraphQL with string sender', () => {
        const graphqlData = {
            digest: 'TestDigest',
            sender: '0xsenderString',
            checkpoint: 100,
            timestampMs: 1000000,
            effects: {
                status: 'success',
                executedEpoch: 50,
                gasEffects: { gasSummary: {} },
                balanceChanges: { nodes: [] },
                objectChanges: { nodes: [] },
                events: { nodes: [] },
            },
        };

        const normalized = getTransactionData(graphqlData);
        expect(normalized.sender).toBe('0xsenderString');
    });
});

describe('getTransactionData - JSON-RPC format', () => {
    it('should handle JSON-RPC dev inspect response', () => {
        const devInspect = {
            jsonrpc: '2.0',
            result: {
                effects: {
                    transactionDigest: 'DevInspectDigest',
                    status: { status: 'success' },
                    executedEpoch: '10',
                    gasUsed: {
                        computationCost: '1000',
                    },
                },
                results: [{ returnValues: [] }],
                events: [],
                checkpoint: {
                    sequenceNumber: 12345,
                },
                timestampMs: 1000000000,
            },
        };

        const normalized = getTransactionData(devInspect);

        expect(normalized.digest).toBe('DevInspectDigest');
        expect(normalized.sender).toBe(null);
        expect(normalized.effects.checkpoint.sequenceNumber).toBe(12345);
        expect(normalized.effects.checkpoint.timestamp).toBe(1000000000);
        expect(normalized.devInspectResults).toBeDefined();
    });

    it('should handle regular JSON-RPC transaction response', () => {
        const jsonRpc = {
            jsonrpc: '2.0',
            result: {
                input: {
                    sender: '0xsender',
                },
                effects: {
                    transactionDigest: 'TxDigest',
                    status: { status: 'success' },
                    executedEpoch: '20',
                    gasUsed: {},
                },
                objectChanges: [],
                balanceChanges: [],
                events: [],
                checkpoint: {
                    sequenceNumber: 99999,
                },
                timestampMs: 2000000000,
            },
        };

        const normalized = getTransactionData(jsonRpc);

        expect(normalized.digest).toBe('TxDigest');
        expect(normalized.sender).toBe('0xsender');
        expect(normalized.effects.checkpoint.sequenceNumber).toBe(99999);
        expect(normalized.effects.checkpoint.timestamp).toBe(2000000000);
    });

    it('should handle JSON-RPC with checkpoint as string', () => {
        const jsonRpc = {
            jsonrpc: '2.0',
            result: {
                input: {
                    sender: '0xsender2',
                },
                effects: {
                    transactionDigest: 'TxDigest2',
                    status: { status: 'success' },
                    executedEpoch: '392',
                    gasUsed: {},
                },
                objectChanges: [],
                balanceChanges: [],
                events: [],
                checkpoint: '152236900', // String format
                timestampMs: '1765741040123',
            },
        };

        const normalized = getTransactionData(jsonRpc);

        expect(normalized.digest).toBe('TxDigest2');
        expect(normalized.sender).toBe('0xsender2');
        expect(normalized.effects.checkpoint.sequenceNumber).toBe('152236900');
        expect(normalized.effects.checkpoint.timestamp).toBe(1765741040123);
        expect(normalized.effects.executedEpoch).toBe('392');
        // Verify checkpoint is different from executedEpoch
        expect(normalized.effects.checkpoint.sequenceNumber).not.toBe(normalized.effects.executedEpoch);
    });

    it('should handle JSON-RPC with checkpoint as number', () => {
        const jsonRpc = {
            jsonrpc: '2.0',
            result: {
                input: {
                    sender: '0xsender3',
                },
                effects: {
                    transactionDigest: 'TxDigest3',
                    status: { status: 'success' },
                    executedEpoch: '50',
                    gasUsed: {},
                },
                objectChanges: [],
                balanceChanges: [],
                events: [],
                checkpoint: 152236900, // Number format
                timestampMs: 1765741040123,
            },
        };

        const normalized = getTransactionData(jsonRpc);

        expect(normalized.digest).toBe('TxDigest3');
        expect(normalized.sender).toBe('0xsender3');
        expect(normalized.effects.checkpoint.sequenceNumber).toBe(152236900);
        expect(normalized.effects.checkpoint.timestamp).toBe(1765741040123);
    });
});

describe('getTransactionData - Raw transaction format', () => {
    it('should handle raw transaction data without effects', () => {
        const rawTx = {
            version: 1,
            sender: '0xrawSender',
            inputs: [{ type: 'pure', value: '123' }],
            commands: [{ kind: 'MoveCall' }],
            gasData: {
                budget: '10000',
                price: '1000',
            },
            expiration: { None: null },
        };

        const normalized = getTransactionData(rawTx);

        expect(normalized.sender).toBe('0xrawSender');
        expect(normalized.effects.status.status).toBe('pending');
        expect(normalized.transactionData).toBeDefined();
        expect(normalized.transactionData.inputs).toEqual(rawTx.inputs);
        expect(normalized.transactionData.commands).toEqual(rawTx.commands);
    });
});

describe('getTransactionData - Direct format with effects', () => {
    it('should handle direct format and normalize checkpoint', () => {
        const directData = {
            digest: 'DirectDigest',
            sender: '0xdirectSender',
            effects: {
                transactionDigest: 'DirectDigest',
                status: { status: 'success' },
                executedEpoch: '30',
                gasUsed: {},
                checkpoint: {
                    sequenceNumber: 555,
                    timestamp: 3000000000,
                },
                gasEffects: {
                    gasSummary: {},
                },
            },
            objectChanges: [],
            balanceChanges: [],
            events: [],
        };

        const normalized = getTransactionData(directData);

        expect(normalized.digest).toBe('DirectDigest');
        expect(normalized.sender).toBe('0xdirectSender');
        expect(normalized.effects.checkpoint.sequenceNumber).toBe(555);
        expect(normalized.effects.checkpoint.timestamp).toBe(3000000000);
    });

    it('should use fallback for missing checkpoint', () => {
        const directData = {
            digest: 'NoCheckpoint',
            sender: '0xsender',
            effects: {
                transactionDigest: 'NoCheckpoint',
                status: { status: 'success' },
                executedEpoch: '40',
                gasUsed: {},
            },
            objectChanges: [],
        };

        const normalized = getTransactionData(directData);

        expect(normalized.effects.checkpoint.sequenceNumber).toBe(null);
        expect(normalized.effects.checkpoint.timestamp).toBe(null);
    });
});

describe('getTransactionData - Signed transaction format', () => {
    it('should extract transaction data from signed format', () => {
        const signedTx = {
            intentMessage: {
                value: {
                    V1: {
                        sender: '0xSignedSender',
                        kind: {
                            ProgrammableTransaction: {
                                inputs: [{ type: 'pure' }],
                                commands: [{ MoveCall: {} }],
                            },
                        },
                        gasData: {
                            budget: '5000',
                        },
                        expiration: { None: null },
                    },
                },
            },
            txSignatures: ['signature1'],
        };

        const normalized = getTransactionData(signedTx);

        expect(normalized.sender).toBe('0xSignedSender');
        expect(normalized.signatures).toEqual(['signature1']);
        expect(normalized.transactionData).toBeDefined();
    });
});

describe('getTransactionData - Checkpoint handling', () => {
    it('should correctly distinguish executedEpoch from checkpoint.sequenceNumber', () => {
        const data = {
            digest: 'Test',
            sender: '0xtest',
            checkpoint: 12345,
            timestampMs: 1000000,
            effects: {
                status: 'success',
                executedEpoch: 999, // Different from checkpoint
                gasEffects: { gasSummary: {} },
                balanceChanges: { nodes: [] },
                objectChanges: { nodes: [] },
                events: { nodes: [] },
            },
        };

        const normalized = getTransactionData(data);

        // executedEpoch and checkpoint.sequenceNumber should be different
        expect(normalized.effects.executedEpoch).toBe(999);
        expect(normalized.effects.checkpoint.sequenceNumber).toBe(12345);
        expect(normalized.effects.checkpoint.sequenceNumber).not.toBe(
            normalized.effects.executedEpoch,
        );
    });

    it('should properly extract checkpoint and timestampMs from GraphQL format', () => {
        const graphqlData = {
            digest: 'GraphQLDigest',
            sender: { address: '0xgraphql' },
            checkpoint: 152235146, // Top-level number
            timestampMs: 1765740660238, // Top-level number
            effects: {
                status: 'success',
                executedEpoch: 500,
                gasEffects: { gasSummary: {} },
                balanceChanges: { nodes: [] },
                objectChanges: { nodes: [] },
                events: { nodes: [] },
            },
        };

        const normalized = getTransactionData(graphqlData);

        // Verify checkpoint data is properly extracted
        expect(normalized.effects.checkpoint.sequenceNumber).toBe(152235146);
        expect(normalized.effects.checkpoint.timestamp).toBe(1765740660238);
        expect(normalized.timestamp).toBe(1765740660238);

        // Verify they are not null
        expect(normalized.effects.checkpoint.sequenceNumber).not.toBeNull();
        expect(normalized.effects.checkpoint.timestamp).not.toBeNull();

        // Verify executedEpoch is different
        expect(normalized.effects.executedEpoch).toBe(500);
        expect(normalized.effects.checkpoint.sequenceNumber).not.toBe(normalized.effects.executedEpoch);
    });
});

describe('getTransactionData - objectChanges conversion', () => {
    it('should convert effects.created and effects.mutated to objectChanges', () => {
        const jsonRpc = {
            jsonrpc: '2.0',
            result: {
                effects: {
                    transactionDigest: 'Test',
                    status: { status: 'success' },
                    created: [
                        {
                            reference: {
                                objectId: '0xcreated1',
                                version: '1',
                                digest: 'digest1',
                            },
                            owner: { AddressOwner: '0xowner1' },
                        },
                    ],
                    mutated: [
                        {
                            reference: {
                                objectId: '0xmutated1',
                                version: '2',
                                digest: 'digest2',
                            },
                            owner: '0xowner2',
                        },
                    ],
                },
            },
        };

        const normalized = getTransactionData(jsonRpc);

        expect(normalized.objectChanges).toHaveLength(2);
        expect(normalized.objectChanges[0].type).toBe('created');
        expect(normalized.objectChanges[0].objectId).toBe('0xcreated1');
        expect(normalized.objectChanges[0].owner).toBe('0xowner1');
        expect(normalized.objectChanges[1].type).toBe('mutated');
        expect(normalized.objectChanges[1].objectId).toBe('0xmutated1');
        expect(normalized.objectChanges[1].owner).toBe('0xowner2');
    });
});

describe('getTransactionData - Fixture file parsing', () => {
    it('should parse GraphQL fixture and extract checkpoint data', () => {
        const normalized = getTransactionData(graphqlTx);

        expect(normalized).toBeDefined();
        expect(normalized.digest).toBe(graphqlTx.digest);

        // Verify checkpoint data is extracted
        console.log('GraphQL checkpoint:', {
            raw: graphqlTx.checkpoint,
            rawTimestamp: graphqlTx.timestampMs,
            normalized: normalized.effects.checkpoint,
        });

        expect(normalized.effects.checkpoint).toBeDefined();
        expect(normalized.effects.checkpoint.sequenceNumber).toBeDefined();
        expect(normalized.effects.checkpoint.timestamp).toBeDefined();

        // Checkpoint should not be null
        expect(normalized.effects.checkpoint.sequenceNumber).not.toBeNull();
        expect(normalized.effects.checkpoint.timestamp).not.toBeNull();
    });

    it('should parse JSON-RPC fixture and extract checkpoint data', () => {
        const normalized = getTransactionData(jsonRpcTx);

        expect(normalized).toBeDefined();
        expect(normalized.digest).toBe(jsonRpcTx.result.digest);

        // Verify checkpoint data is extracted
        console.log('JSON-RPC checkpoint:', {
            raw: jsonRpcTx.result.checkpoint,
            rawTimestamp: jsonRpcTx.result.timestampMs,
            normalized: normalized.effects.checkpoint,
        });

        expect(normalized.effects.checkpoint).toBeDefined();
        expect(normalized.effects.checkpoint.sequenceNumber).toBeDefined();
        expect(normalized.effects.checkpoint.timestamp).toBeDefined();

        // Checkpoint should not be null
        expect(normalized.effects.checkpoint.sequenceNumber).not.toBeNull();
        expect(normalized.effects.checkpoint.timestamp).not.toBeNull();

        // Checkpoint should match raw value, timestamp should be converted to number
        expect(normalized.effects.checkpoint.sequenceNumber).toBe(jsonRpcTx.result.checkpoint);
        expect(normalized.effects.checkpoint.timestamp).toBe(parseInt(jsonRpcTx.result.timestampMs));
    });

    it('should extract the same transaction digest from both fixtures', () => {
        const graphqlNormalized = getTransactionData(graphqlTx);
        const jsonRpcNormalized = getTransactionData(jsonRpcTx);

        // Both should have the same digest since they represent the same transaction
        expect(graphqlNormalized.digest).toBe('2TnHWYGpoYfwHwSA2be1eAxqmo3uBzHvabqvKvcrf1sV');
        expect(jsonRpcNormalized.digest).toBe('2TnHWYGpoYfwHwSA2be1eAxqmo3uBzHvabqvKvcrf1sV');
        expect(graphqlNormalized.digest).toBe(jsonRpcNormalized.digest);
    });

    it('should parse signed transaction fixture', () => {
        // Decode the signed transaction
        const signedTxData = fromBase64(signedTxBase64);

        // The signed tx should be valid data
        expect(signedTxData).toBeDefined();
        expect(signedTxData.length).toBeGreaterThan(0);
    });

    it('should parse unsigned transaction fixture', () => {
        // Decode the unsigned transaction
        const unsignedTxData = fromBase64(unsignedTxBase64);

        // The unsigned tx should be valid data
        expect(unsignedTxData).toBeDefined();
        expect(unsignedTxData.length).toBeGreaterThan(0);
    });

    it('should distinguish executedEpoch from checkpoint in fixtures', () => {
        const graphqlNormalized = getTransactionData(graphqlTx);
        const jsonRpcNormalized = getTransactionData(jsonRpcTx);

        // JSON-RPC should have executedEpoch (GraphQL fixture doesn't have it)
        expect(jsonRpcNormalized.effects.executedEpoch).toBeDefined();

        // Both should have checkpoint sequenceNumber
        expect(graphqlNormalized.effects.checkpoint.sequenceNumber).toBeDefined();
        expect(jsonRpcNormalized.effects.checkpoint.sequenceNumber).toBeDefined();

        // JSON-RPC: executedEpoch and checkpoint should be different values
        expect(jsonRpcNormalized.effects.executedEpoch).not.toBe(
            jsonRpcNormalized.effects.checkpoint.sequenceNumber
        );

        // Verify actual values
        expect(jsonRpcNormalized.effects.executedEpoch).toBe('392');
        expect(jsonRpcNormalized.effects.checkpoint.sequenceNumber).toBe('152236900');

        console.log('GraphQL checkpoint:', graphqlNormalized.effects.checkpoint.sequenceNumber);
        console.log('JSON-RPC - executedEpoch:', jsonRpcNormalized.effects.executedEpoch,
            'checkpoint:', jsonRpcNormalized.effects.checkpoint.sequenceNumber);
    });
});

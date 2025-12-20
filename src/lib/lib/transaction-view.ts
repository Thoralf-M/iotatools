/**
 * Utility functions for formatting and displaying transaction data
 */

import { fromB64 } from '@iota/bcs';
import { bcs as IotaBcs } from '@iota/iota-sdk/bcs';
import { TransactionDataBuilder } from '@iota/iota-sdk/transactions';

/**
 * Recursively removes $kind fields from objects to clean up display data
 */
export function removeKindFields(obj: any): any {
    if (obj === null || obj === undefined) return obj;

    if (Array.isArray(obj)) {
        return obj.map((item) => removeKindFields(item));
    }

    if (typeof obj === 'object') {
        const cleaned: any = {};
        for (const [key, value] of Object.entries(obj)) {
            if (key !== '$kind') {
                cleaned[key] = removeKindFields(value);
            }
        }
        return cleaned;
    }

    return obj;
}

/**
 * Formats JSON with compact number arrays (displays number arrays on single lines)
 * while maintaining proper indentation for other data types
 */
export function formatJsonWithCompactArrays(obj: any, indent: number = 0): string {
    const indentStr = '  '.repeat(indent);
    const nextIndentStr = '  '.repeat(indent + 1);

    if (obj === null) return 'null';
    if (typeof obj === 'undefined') return 'undefined';
    if (typeof obj === 'string') return JSON.stringify(obj);
    if (typeof obj === 'number' || typeof obj === 'boolean') return String(obj);

    if (Array.isArray(obj)) {
        // Check if all elements are numbers
        const allNumbers = obj.every((item) => typeof item === 'number');

        if (allNumbers && obj.length > 0) {
            // Format numbers in a single line
            return `[${obj.join(', ')}]`;
        } else if (obj.length === 0) {
            return '[]';
        } else {
            // Regular array formatting for non-number arrays
            const items = obj
                .map((item) => nextIndentStr + formatJsonWithCompactArrays(item, indent + 1))
                .join(',\n');
            return `[\n${items}\n${indentStr}]`;
        }
    }

    if (typeof obj === 'object') {
        const keys = Object.keys(obj);
        if (keys.length === 0) return '{}';

        const items = keys
            .map((key) => {
                const value = formatJsonWithCompactArrays(obj[key], indent + 1);
                return `${nextIndentStr}${JSON.stringify(key)}: ${value}`;
            })
            .join(',\n');

        return `{\n${items}\n${indentStr}}`;
    }

    return String(obj);
}

/**
 * Normalizes owner field from various formats to a consistent string representation
 */
export function normalizeOwner(owner: any): any {
    if (!owner) return null;

    // If it's already a string, return as is
    if (typeof owner === 'string') {
        return owner;
    }

    // Handle different owner object formats
    if (typeof owner === 'object') {
        // Extract the actual address from nested owner objects
        if (owner.AddressOwner) {
            return owner.AddressOwner;
        }
        if (owner.ObjectOwner) {
            return `Object ${owner.ObjectOwner}`;
        }
        if (owner.Shared) {
            return 'Shared';
        }
        if (owner.Immutable) {
            return 'Immutable';
        }
    }

    return owner;
}

/**
 * Converts GraphQL object changes format to standard object changes format
 */
function convertGraphQLObjectChanges(graphqlObjectChanges: any[]): any[] {
    return graphqlObjectChanges.map((change: any) => {
        // Determine the type of change
        let type = 'mutated'; // default
        if (change.idCreated) {
            type = 'created';
        } else if (change.idDeleted) {
            type = 'deleted';
        }

        // Extract object ID
        const objectId = change.idCreated || change.address || change.idDeleted;

        // Extract object type from contents if available
        let objectType = '';
        if (change.outputState?.asMoveObject?.contents?.json?.type) {
            objectType = change.outputState.asMoveObject.contents.json.type;
        } else if (change.inputState?.asMoveObject?.contents?.json?.type) {
            objectType = change.inputState.asMoveObject.contents.json.type;
        }

        // Fix the GraphQL data by ensuring the `id` field is properly handled
        // Note: We don't set the id field because TransactionEffects component
        // intentionally sets it to undefined and displays object ID separately
        let fixedInputState = change.inputState;
        let fixedOutputState = change.outputState;

        // For GraphQL, preserve the original structure but add standard fields for compatibility
        return {
            // Standard fields for compatibility with other formats
            type,
            objectId,
            version: null, // GraphQL doesn't provide version in this format
            digest: null, // GraphQL doesn't provide digest in this format
            owner: change.address || null, // Use address as owner for GraphQL format
            objectType,

            // Preserve GraphQL-specific structure for the TransactionEffects component
            idCreated: change.idCreated,
            idDeleted: change.idDeleted,
            address: change.address,
            inputState: fixedInputState,
            outputState: fixedOutputState,

            // Mark this as GraphQL data for the component to handle appropriately
            isGraphQLFormat: true,
        };
    });
}

/**
 * Determines if the provided data represents transaction data in any of the supported formats
 */
export function isTransactionData(data: any): boolean {
    // Handle raw transaction data format (Format 1)
    if (
        data &&
        typeof data === 'object' &&
        data.sender &&
        data.inputs &&
        data.commands &&
        data.gasData
    ) {
        return true;
    }

    // Handle signed transaction format (Format 2)
    if (
        data &&
        typeof data === 'object' &&
        data.intentMessage &&
        data.txSignatures &&
        data.intentMessage.value
    ) {
        return true;
    }

    // Handle direct transaction data format (with effects)
    if (
        data &&
        typeof data === 'object' &&
        (data.digest || data.effects || data.decodedBCS || (data.sender && data.timestamp))
    ) {
        return true;
    }

    // Handle JSON-RPC response format (regular transaction)
    if (
        data &&
        typeof data === 'object' &&
        data.jsonrpc &&
        data.result &&
        typeof data.result === 'object' &&
        (data.result.effects || data.result.input)
    ) {
        return true;
    }

    // Handle dev inspect JSON-RPC response format
    if (
        data &&
        typeof data === 'object' &&
        data.jsonrpc &&
        data.result &&
        typeof data.result === 'object' &&
        data.result.effects &&
        data.result.results
    ) {
        return true;
    }

    // Handle GraphQL response format (from graphql-fetcher.ts)
    if (
        data &&
        typeof data === 'object' &&
        data.digest &&
        data.sender &&
        data.effects &&
        data.effects.objectChanges &&
        data.effects.objectChanges.nodes
    ) {
        return true;
    }

    // Handle web wallet signing response format (with base64 encoded bytes and effects)
    if (
        data &&
        typeof data === 'object' &&
        data.digest &&
        data.signature &&
        data.bytes &&
        data.effects &&
        typeof data.bytes === 'string' &&
        typeof data.effects === 'string'
    ) {
        return true;
    }

    return false;
}

/**
 * Normalizes and transforms transaction data from various formats into a consistent structure
 * that the TransactionEffects component can work with
 */
export function getTransactionData(data: any): any {
    // Handle JSON RPC transaction data format (with transaction.data.transaction)
    if (
        data &&
        data.digest &&
        data.transaction?.data?.transaction?.kind === 'ProgrammableTransaction'
    ) {
        const tx = data.transaction.data.transaction;
        const normalized = {
            sender: data.transaction.data.sender,
            inputs: tx.inputs,
            commands: tx.transactions, // transactions are the commands in this format
            gasData: data.transaction.data.gasData,
            digest: data.digest,
            // Include signatures if available
            signatures: data.transaction.txSignatures,
            // Include other original data safely, but exclude transaction to avoid recursion
            ...Object.fromEntries(Object.entries(data).filter(([k]) => k !== 'transaction')),
        };
        return getTransactionData(normalized);
    }

    // Handle web wallet signing response format (with base64 encoded bytes and effects)
    if (
        data &&
        typeof data === 'object' &&
        data.digest &&
        data.signature &&
        data.bytes &&
        data.effects &&
        typeof data.bytes === 'string' &&
        typeof data.effects === 'string'
    ) {
        // Decode the transaction bytes
        let decodedTransaction: any = null;
        try {
            const txBytes = fromB64(data.bytes);
            decodedTransaction = TransactionDataBuilder.fromBytes(txBytes);
        } catch (e) {
            console.warn('Failed to decode transaction bytes from web wallet response:', e);
        }

        // Decode the effects
        let decodedEffects: any = null;
        try {
            decodedEffects = IotaBcs.TransactionEffects.parse(fromB64(data.effects));
        } catch (e) {
            console.warn('Failed to decode effects from web wallet response:', e);
        }

        // Build a normalized structure similar to other transaction formats
        const normalized = {
            digest: data.digest,
            sender: decodedTransaction?.sender || null,
            timestamp: null, // Web wallet response doesn't include timestamp
            signatures: [data.signature],
            effects: decodedEffects
                ? {
                      transactionDigest: data.digest,
                      status: decodedEffects.status || { status: 'success' },
                      executedEpoch: decodedEffects.executedEpoch,
                      gasUsed: decodedEffects.gasUsed,
                      modifiedAtVersions: decodedEffects.modifiedAtVersions,
                      sharedObjects: decodedEffects.sharedObjects,
                      dependencies: decodedEffects.dependencies,
                      checkpoint: {
                          sequenceNumber: null,
                          timestamp: null,
                      },
                      gasEffects: {
                          gasSummary: decodedEffects.gasUsed,
                      },
                      balanceChanges: {
                          nodes: [],
                      },
                      objectChanges: {
                          nodes: [],
                      },
                      events: {
                          nodes: [],
                      },
                  }
                : {
                      status: { status: 'unknown' },
                      gasUsed: {
                          computationCost: '0',
                          storageCost: '0',
                          storageRebate: '0',
                          nonRefundableStorageFee: '0',
                      },
                      checkpoint: { sequenceNumber: null, timestamp: null },
                      gasEffects: { gasSummary: {} },
                      balanceChanges: { nodes: [] },
                      objectChanges: { nodes: [] },
                      events: { nodes: [] },
                  },
            // Include decoded transaction data if available
            ...(decodedTransaction
                ? {
                      input: {
                          transaction: {
                              inputs: decodedTransaction.inputs,
                              transactions: decodedTransaction.commands,
                          },
                          gasData: decodedTransaction.gasData,
                      },
                      decodedBCS: {
                          intentMessage: {
                              value: {
                                  V1: {
                                      kind: {
                                          ProgrammableTransaction: {
                                              inputs: decodedTransaction.inputs,
                                              commands: decodedTransaction.commands,
                                          },
                                      },
                                  },
                              },
                          },
                      },
                      transactionData: decodedTransaction,
                  }
                : {}),
            // Include original web wallet response
            webWalletResponse: data,
        };

        return normalized;
    }

    // Handle GraphQL response format (from graphql-fetcher.ts) first
    // GraphQL has checkpoint and timestampMs at top level as numbers
    if (
        data &&
        data.digest &&
        data.sender &&
        data.effects &&
        (typeof data.checkpoint === 'number' || typeof data.timestampMs === 'number')
    ) {
        // Convert GraphQL object changes to standard format
        const objectChanges = data.effects.objectChanges?.nodes
            ? convertGraphQLObjectChanges(data.effects.objectChanges.nodes)
            : [];

        // Convert GraphQL balance changes to standard format
        const balanceChanges = data.effects.balanceChanges?.nodes || [];

        // Convert GraphQL events to standard format
        const events = data.effects.events?.nodes || [];

        // Decode BCS transaction data if available
        let decodedBCS: any = null;
        if (data.effects.transactionBlock?.bcs) {
            try {
                decodedBCS = IotaBcs.SenderSignedData.parse(
                    fromB64(data.effects.transactionBlock.bcs),
                )[0];
            } catch (e) {
                console.warn('Failed to decode BCS data for transaction:', data.digest, e);
            }
        }

        // Extract checkpoint data - can be at top level or nested in effects
        const checkpointSeqNum =
            typeof data.checkpoint === 'number'
                ? data.checkpoint
                : data.effects.checkpoint?.sequenceNumber;
        const checkpointTimestamp = data.timestampMs || data.effects.checkpoint?.timestamp;

        const normalized = {
            digest: data.digest,
            sender: data.sender?.address || data.sender,
            timestamp: checkpointTimestamp,
            effects: {
                transactionDigest: data.digest,
                status: { status: data.effects.status },
                executedEpoch: data.effects.executedEpoch,
                gasUsed: data.effects.gasEffects?.gasSummary,
                checkpoint: {
                    sequenceNumber: checkpointSeqNum ?? null,
                    timestamp: checkpointTimestamp ?? null,
                },
                gasEffects: {
                    gasSummary: data.effects.gasEffects?.gasSummary,
                },
                balanceChanges: {
                    nodes: balanceChanges,
                },
                objectChanges: {
                    nodes: objectChanges,
                },
                events: {
                    nodes: events,
                },
                // Include transaction block BCS data if available
                transactionBlock: data.effects.transactionBlock,
            },
            // Include the original arrays at the top level too for compatibility
            objectChanges: objectChanges,
            balanceChanges: balanceChanges,
            events: events,
            // Include decoded BCS data if available
            decodedBCS: decodedBCS,
            // Include original GraphQL data
            graphqlData: data,
        };
        return normalized;
    }

    // Handle signed transaction format (Format 2) - extract transaction data first
    if (data && data.intentMessage && data.txSignatures && data.intentMessage.value) {
        let transactionData;
        if (data.intentMessage.value.V1) {
            // Extract the transaction data from the V1 format
            const v1Data = data.intentMessage.value.V1;
            if (v1Data.kind && v1Data.kind.ProgrammableTransaction) {
                transactionData = {
                    version: 1, // or extract from somewhere else if available
                    sender: v1Data.sender,
                    inputs: v1Data.kind.ProgrammableTransaction.inputs,
                    commands: v1Data.kind.ProgrammableTransaction.commands,
                    gasData: v1Data.gasData,
                    expiration: v1Data.expiration,
                    // Include signature information
                    signatures: data.txSignatures,
                    // Include original signed data for reference
                    originalSignedData: data,
                };
            }
        }
        if (transactionData) {
            // Recursively process the extracted transaction data
            return getTransactionData(transactionData);
        }
    }

    // Handle raw transaction data format (Format 1)
    if (data && data.sender && data.inputs && data.commands && data.gasData) {
        // This is a raw transaction data format - normalize it
        let txDigest = null;
        // Only try to build digest if commands are in BCS format (have $kind)
        if (
            data.commands &&
            data.commands.length > 0 &&
            data.commands[0] &&
            '$kind' in data.commands[0]
        ) {
            try {
                let txData = new TransactionDataBuilder(data);
                let txBytes = txData.build();
                txDigest = TransactionDataBuilder.getDigestFromBytes(txBytes);
            } catch (e) {
                try {
                    let txData = new TransactionDataBuilder(data);
                    let txBytes = txData.build();
                    txDigest = TransactionDataBuilder.getDigestFromBytes(txBytes);
                } catch (e) {
                    console.log('error SenderSignedData', e);
                }
            }
        }

        const normalized = {
            digest: txDigest,
            sender: data.sender,
            timestamp: null,
            // Create effects structure for compatibility
            effects: {
                status: { status: 'pending' },
                gasUsed: {
                    computationCost: '0',
                    storageCost: '0',
                    storageRebate: '0',
                    nonRefundableStorageFee: '0',
                },
                gasEffects: {
                    gasSummary: {
                        computationCost: '0',
                        storageCost: '0',
                        storageRebate: '0',
                        nonRefundableStorageFee: '0',
                    },
                },
                balanceChanges: { nodes: [] },
                objectChanges: { nodes: [] },
                events: { nodes: [] },
            },
            // Map inputs and commands to expected paths for TransactionEffects component
            input: {
                transaction: {
                    inputs: data.inputs,
                    transactions: data.commands, // commands are called transactions in this path
                },
                gasData: data.gasData,
            },
            // Also map to decodedBCS format for consistency, if commands have $kind
            ...(data.commands && data.commands[0] && data.commands[0].$kind
                ? {
                      decodedBCS: {
                          intentMessage: {
                              value: {
                                  V1: {
                                      kind: {
                                          ProgrammableTransaction: {
                                              inputs: data.inputs,
                                              commands: data.commands,
                                          },
                                      },
                                  },
                              },
                          },
                      },
                  }
                : {}),
            // Include transaction data details
            transactionData: {
                version: data.version,
                sender: data.sender,
                inputs: data.inputs,
                commands: data.commands,
                gasData: data.gasData,
                expiration: data.expiration,
            },
            // Include signature info if available
            signatures: data.signatures,
            // Include all original data
            ...data,
        };
        return normalized;
    }

    // If it's a JSON-RPC response, extract and normalize the result
    if (data && data.jsonrpc && data.result) {
        const result = data.result;

        // Determine objectChanges - prioritize existing objectChanges over effects arrays
        let objectChanges;
        if (result.objectChanges !== undefined) {
            // Use existing objectChanges and normalize owner fields
            objectChanges = result.objectChanges.map((change: any) => ({
                ...change,
                owner: normalizeOwner(change.owner),
            }));
        } else if (result.effects && (result.effects.created || result.effects.mutated)) {
            // Convert effects.created and effects.mutated to objectChanges format
            objectChanges = [
                ...(result.effects.created || []).map((obj: any) => ({
                    type: 'created',
                    objectId: obj.reference?.objectId,
                    version: obj.reference?.version,
                    digest: obj.reference?.digest,
                    owner: normalizeOwner(obj.owner),
                    objectType: '',
                })),
                ...(result.effects.mutated || []).map((obj: any) => ({
                    type: 'mutated',
                    objectId: obj.reference?.objectId,
                    version: obj.reference?.version,
                    digest: obj.reference?.digest,
                    owner: normalizeOwner(obj.owner),
                    objectType: '',
                })),
            ];
        } else {
            objectChanges = [];
        }

        // Check if it's a dev inspect response
        if (result.effects && result.results) {
            const normalized = {
                // Map the fields to match what TransactionEffects expects
                digest: result.effects?.transactionDigest,
                sender: null, // Dev inspect doesn't have sender info
                timestamp: null,
                effects: {
                    // Selectively include effects properties, excluding created/mutated to avoid conflicts
                    transactionDigest: result.effects?.transactionDigest,
                    status: result.effects?.status,
                    executedEpoch: result.effects?.executedEpoch,
                    gasUsed: result.effects?.gasUsed,
                    modifiedAtVersions: result.effects?.modifiedAtVersions,
                    sharedObjects: result.effects?.sharedObjects,
                    dependencies: result.effects?.dependencies,
                    checkpoint: {
                        sequenceNumber: result.checkpoint?.sequenceNumber || null,
                        timestamp: result.timestampMs
                            ? typeof result.timestampMs === 'string'
                                ? parseInt(result.timestampMs)
                                : result.timestampMs
                            : null,
                    },
                    // Map gas structure
                    gasEffects: {
                        gasSummary: result.effects?.gasUsed,
                    },
                    // Map the arrays to the expected structure
                    balanceChanges: {
                        nodes: [],
                    },
                    objectChanges: {
                        nodes: objectChanges,
                    },
                    events: {
                        nodes: result.events || [],
                    },
                },
                // Include the original arrays at the top level too for compatibility
                objectChanges: objectChanges,
                balanceChanges: [],
                events: result.events || [],
                // Add dev inspect specific data
                devInspectResults: result.results,
                // Include other original data safely
                input: result.input,
                timestampMs: result.timestampMs,
                checkpoint: result.checkpoint,
            };
            return normalized;
        }

        // Regular JSON-RPC transaction response (handles all other cases)
        const normalized = {
            // Map the fields to match what TransactionEffects expects
            digest: result.effects?.transactionDigest,
            sender: result.input?.sender,
            timestamp: null, // JSON-RPC format doesn't include timestamp
            effects: {
                // Selectively include effects properties, excluding created/mutated to avoid conflicts
                transactionDigest: result.effects?.transactionDigest,
                status: result.effects?.status,
                executedEpoch: result.effects?.executedEpoch,
                gasUsed: result.effects?.gasUsed,
                modifiedAtVersions: result.effects?.modifiedAtVersions,
                sharedObjects: result.effects?.sharedObjects,
                dependencies: result.effects?.dependencies,
                checkpoint: {
                    sequenceNumber:
                        typeof result.checkpoint === 'string' ||
                        typeof result.checkpoint === 'number'
                            ? result.checkpoint
                            : result.checkpoint?.sequenceNumber || null,
                    timestamp: result.timestampMs
                        ? typeof result.timestampMs === 'string'
                            ? parseInt(result.timestampMs)
                            : result.timestampMs
                        : null,
                },
                // Map gas structure
                gasEffects: {
                    gasSummary: result.effects?.gasUsed,
                },
                // Map the arrays to the expected structure
                balanceChanges: {
                    nodes: result.balanceChanges || [],
                },
                objectChanges: {
                    nodes: objectChanges,
                },
                events: {
                    nodes: result.events || [],
                },
            },
            // Include the original arrays at the top level too for compatibility
            objectChanges: objectChanges,
            balanceChanges: result.balanceChanges || [],
            events: result.events || [],
            // Include other original data, but exclude potentially conflicting arrays
            input: result.input,
            timestampMs: result.timestampMs,
            checkpoint: result.checkpoint,
        };
        return normalized;
    }

    // Check if it's the direct format but missing some fields
    if (data && data.effects) {
        // Determine objectChanges - prioritize existing objectChanges over effects arrays
        let objectChanges;
        if (data.objectChanges !== undefined) {
            // Use existing objectChanges and normalize owner fields
            objectChanges = data.objectChanges.map((change: any) => ({
                ...change,
                owner: normalizeOwner(change.owner),
            }));
        } else if (data.effects && (data.effects.created || data.effects.mutated)) {
            // Convert effects.created and effects.mutated to objectChanges format
            objectChanges = [
                ...(data.effects.created || []).map((obj: any) => ({
                    type: 'created',
                    objectId: obj.reference?.objectId,
                    version: obj.reference?.version,
                    digest: obj.reference?.digest,
                    owner: normalizeOwner(obj.owner),
                    objectType: '',
                })),
                ...(data.effects.mutated || []).map((obj: any) => ({
                    type: 'mutated',
                    objectId: obj.reference?.objectId,
                    version: obj.reference?.version,
                    digest: obj.reference?.digest,
                    owner: normalizeOwner(obj.owner),
                    objectType: '',
                })),
            ];
        } else {
            objectChanges = [];
        }

        const normalized = {
            ...data,
            digest: data.digest || data.effects?.transactionDigest,
            sender: data?.transaction?.data?.sender || data.sender || data.input?.sender,
            objectChanges: objectChanges,
            effects: {
                // Selectively include effects properties, excluding created/mutated to avoid conflicts
                transactionDigest: data.effects?.transactionDigest,
                status: data.effects?.status,
                executedEpoch: data.effects?.executedEpoch,
                gasUsed: data.effects?.gasUsed,
                modifiedAtVersions: data.effects?.modifiedAtVersions,
                sharedObjects: data.effects?.sharedObjects,
                dependencies: data.effects?.dependencies,
                messageVersion: data.effects?.messageVersion,
                gasObject: data.effects?.gasObject,
                eventsDigest: data.effects?.eventsDigest,
                checkpoint: {
                    sequenceNumber:
                        typeof data.checkpoint === 'string' || typeof data.checkpoint === 'number'
                            ? data.checkpoint
                            : data.effects.checkpoint?.sequenceNumber || null,
                    timestamp: data.timestampMs
                        ? typeof data.timestampMs === 'string'
                            ? parseInt(data.timestampMs)
                            : data.timestampMs
                        : data.effects.checkpoint?.timestamp || null,
                },
                gasEffects: data.effects.gasEffects || {
                    gasSummary: data.effects?.gasUsed,
                },
                objectChanges: {
                    nodes: objectChanges,
                },
                balanceChanges: {
                    nodes: data.balanceChanges || [],
                },
                events: {
                    nodes: data.events || [],
                },
            },
        };
        return normalized;
    }

    return data;
}

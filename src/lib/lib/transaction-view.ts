/**
 * Utility functions for formatting and displaying transaction data
 */

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

    return false;
}

/**
 * Normalizes and transforms transaction data from various formats into a consistent structure
 * that the TransactionEffects component can work with
 */
export function getTransactionData(data: any): any {
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
        const normalized = {
            // Create a mock digest since this is unsigned transaction data
            digest: null,
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
            },
            // Also map to decodedBCS format for consistency
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
                        sequenceNumber: result.effects?.executedEpoch,
                        timestamp: null,
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
                    sequenceNumber: result.effects?.executedEpoch,
                    timestamp: null,
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
            sender: data.sender || data.input?.sender,
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
                checkpoint: data.effects.checkpoint || {
                    sequenceNumber: data.effects?.executedEpoch,
                    timestamp: null,
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

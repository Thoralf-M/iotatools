import { y as fromBase64, T as TransactionDataBuilder, z as iotaBcs } from "./index-CrBkJ6Na.js";
function removeKindFields(obj) {
  if (obj === null || obj === void 0) return obj;
  if (Array.isArray(obj)) {
    return obj.map((item) => removeKindFields(item));
  }
  if (typeof obj === "object") {
    const cleaned = {};
    for (const [key, value] of Object.entries(obj)) {
      if (key !== "$kind") {
        cleaned[key] = removeKindFields(value);
      }
    }
    return cleaned;
  }
  return obj;
}
function formatJsonWithCompactArrays(obj, indent = 0) {
  const indentStr = "  ".repeat(indent);
  const nextIndentStr = "  ".repeat(indent + 1);
  if (obj === null) return "null";
  if (typeof obj === "undefined") return "undefined";
  if (typeof obj === "string") return JSON.stringify(obj);
  if (typeof obj === "number" || typeof obj === "boolean") return String(obj);
  if (Array.isArray(obj)) {
    const allNumbers = obj.every((item) => typeof item === "number");
    if (allNumbers && obj.length > 0) {
      return `[${obj.join(", ")}]`;
    } else if (obj.length === 0) {
      return "[]";
    } else {
      const items = obj.map((item) => nextIndentStr + formatJsonWithCompactArrays(item, indent + 1)).join(",\n");
      return `[
${items}
${indentStr}]`;
    }
  }
  if (typeof obj === "object") {
    const keys = Object.keys(obj);
    if (keys.length === 0) return "{}";
    const items = keys.map((key) => {
      const value = formatJsonWithCompactArrays(obj[key], indent + 1);
      return `${nextIndentStr}${JSON.stringify(key)}: ${value}`;
    }).join(",\n");
    return `{
${items}
${indentStr}}`;
  }
  return String(obj);
}
function normalizeOwner(owner) {
  if (!owner) return null;
  if (typeof owner === "string") {
    return owner;
  }
  if (typeof owner === "object") {
    if (owner.AddressOwner) {
      return owner.AddressOwner;
    }
    if (owner.ObjectOwner) {
      return `Object ${owner.ObjectOwner}`;
    }
    if (owner.Shared) {
      return "Shared";
    }
    if (owner.Immutable) {
      return "Immutable";
    }
  }
  return owner;
}
function convertGraphQLObjectChanges(graphqlObjectChanges) {
  return graphqlObjectChanges.map((change) => {
    let type = "mutated";
    if (change.idCreated) {
      type = "created";
    } else if (change.idDeleted) {
      type = "deleted";
    }
    const objectId = change.idCreated || change.address || change.idDeleted;
    let objectType = "";
    if (change.outputState?.asMoveObject?.contents?.json?.type) {
      objectType = change.outputState.asMoveObject.contents.json.type;
    } else if (change.inputState?.asMoveObject?.contents?.json?.type) {
      objectType = change.inputState.asMoveObject.contents.json.type;
    }
    let fixedInputState = change.inputState;
    let fixedOutputState = change.outputState;
    return {
      // Standard fields for compatibility with other formats
      type,
      objectId,
      version: null,
      // GraphQL doesn't provide version in this format
      digest: null,
      // GraphQL doesn't provide digest in this format
      owner: change.address || null,
      // Use address as owner for GraphQL format
      objectType,
      // Preserve GraphQL-specific structure for the TransactionEffects component
      idCreated: change.idCreated,
      idDeleted: change.idDeleted,
      address: change.address,
      inputState: fixedInputState,
      outputState: fixedOutputState,
      // Mark this as GraphQL data for the component to handle appropriately
      isGraphQLFormat: true
    };
  });
}
function isWebWalletSigningResponse(data) {
  return data && typeof data === "object" && data.digest && data.signature && data.bytes && data.effects && typeof data.digest === "string" && typeof data.signature === "string" && typeof data.bytes === "string" && typeof data.effects === "string";
}
function isTransactionData(data) {
  if (data && typeof data === "object" && data.sender && data.inputs && data.commands && data.gasData) {
    return true;
  }
  if (data && typeof data === "object" && data.intentMessage && data.txSignatures && data.intentMessage.value) {
    return true;
  }
  if (data && typeof data === "object" && (data.digest || data.effects || data.decodedBCS || data.sender && data.timestamp)) {
    return true;
  }
  if (data && typeof data === "object" && data.jsonrpc && data.result && typeof data.result === "object" && (data.result.effects || data.result.input)) {
    return true;
  }
  if (data && typeof data === "object" && data.jsonrpc && data.result && typeof data.result === "object" && data.result.effects && data.result.results) {
    return true;
  }
  if (data && typeof data === "object" && data.digest && data.sender && data.effects && data.effects.objectChanges && data.effects.objectChanges.nodes) {
    return true;
  }
  if (isWebWalletSigningResponse(data)) {
    return true;
  }
  return false;
}
function getTransactionData(data) {
  if (data && data.digest && data.transaction?.data?.transaction?.kind === "ProgrammableTransaction") {
    const tx = data.transaction.data.transaction;
    const normalized = {
      sender: data.transaction.data.sender,
      inputs: tx.inputs,
      commands: tx.transactions,
      // transactions are the commands in this format
      gasData: data.transaction.data.gasData,
      digest: data.digest,
      // Include signatures if available
      signatures: data.transaction.txSignatures,
      // Include other original data safely, but exclude transaction to avoid recursion
      ...Object.fromEntries(Object.entries(data).filter(([k]) => k !== "transaction"))
    };
    return getTransactionData(normalized);
  }
  if (isWebWalletSigningResponse(data)) {
    let decodedTransaction = null;
    try {
      const txBytes = fromBase64(data.bytes);
      decodedTransaction = TransactionDataBuilder.fromBytes(txBytes);
    } catch (e) {
      console.warn("Failed to decode transaction bytes from web wallet response:", e);
    }
    let decodedEffects = null;
    try {
      decodedEffects = iotaBcs.TransactionEffects.parse(fromBase64(data.effects));
      console.log("Decoded effects from web wallet response:", decodedEffects);
    } catch (e) {
      console.warn("Failed to decode effects from web wallet response:", e);
    }
    const normalized = {
      digest: data.digest,
      sender: decodedTransaction?.sender || null,
      timestamp: null,
      // Web wallet response doesn't include timestamp
      signatures: [data.signature],
      effects: decodedEffects ? {
        transactionDigest: data.digest,
        status: decodedEffects.V1?.status ? { status: decodedEffects.V1.status.$kind.toLowerCase() } : { status: "unknown" },
        executedEpoch: decodedEffects.V1?.executedEpoch,
        gasUsed: decodedEffects.V1?.gasUsed,
        modifiedAtVersions: decodedEffects.V1?.modifiedAtVersions,
        sharedObjects: decodedEffects.V1?.sharedObjects,
        dependencies: decodedEffects.V1?.dependencies,
        checkpoint: {
          sequenceNumber: null,
          timestamp: null
        },
        gasEffects: {
          gasSummary: decodedEffects.V1?.gasUsed
        },
        balanceChanges: {
          nodes: []
        },
        objectChanges: {
          nodes: []
        },
        events: {
          nodes: []
        }
      } : {
        status: { status: "unknown" },
        gasUsed: {
          computationCost: "0",
          storageCost: "0",
          storageRebate: "0",
          nonRefundableStorageFee: "0"
        },
        checkpoint: { sequenceNumber: null, timestamp: null },
        gasEffects: { gasSummary: {} },
        balanceChanges: { nodes: [] },
        objectChanges: { nodes: [] },
        events: { nodes: [] }
      },
      // Include decoded transaction data if available
      ...decodedTransaction ? {
        input: {
          transaction: {
            inputs: decodedTransaction.inputs,
            transactions: decodedTransaction.commands
          },
          gasData: decodedTransaction.gasData
        },
        decodedBCS: {
          intentMessage: {
            value: {
              V1: {
                kind: {
                  ProgrammableTransaction: {
                    inputs: decodedTransaction.inputs,
                    commands: decodedTransaction.commands
                  }
                }
              }
            }
          }
        },
        transactionData: decodedTransaction
      } : {},
      // Include original web wallet response
      webWalletResponse: data
    };
    return normalized;
  }
  if (data && data.digest && data.sender && data.effects && (typeof data.checkpoint === "number" || typeof data.timestampMs === "number")) {
    const objectChanges = data.effects.objectChanges?.nodes ? convertGraphQLObjectChanges(data.effects.objectChanges.nodes) : [];
    const balanceChanges = data.effects.balanceChanges?.nodes || [];
    const events = data.effects.events?.nodes || [];
    let decodedBCS = null;
    if (data.effects.transactionBlock?.bcs) {
      try {
        decodedBCS = iotaBcs.SenderSignedData.parse(
          fromBase64(data.effects.transactionBlock.bcs)
        )[0];
      } catch (e) {
        console.warn("Failed to decode BCS data for transaction:", data.digest, e);
      }
    }
    const checkpointSeqNum = typeof data.checkpoint === "number" ? data.checkpoint : data.effects.checkpoint?.sequenceNumber;
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
          timestamp: checkpointTimestamp ?? null
        },
        gasEffects: {
          gasSummary: data.effects.gasEffects?.gasSummary
        },
        balanceChanges: {
          nodes: balanceChanges
        },
        objectChanges: {
          nodes: objectChanges
        },
        events: {
          nodes: events
        },
        // Include transaction block BCS data if available
        transactionBlock: data.effects.transactionBlock
      },
      // Include the original arrays at the top level too for compatibility
      objectChanges,
      balanceChanges,
      events,
      // Include decoded BCS data if available
      decodedBCS,
      // Include original GraphQL data
      graphqlData: data
    };
    return normalized;
  }
  if (data && data.intentMessage && data.txSignatures && data.intentMessage.value) {
    let transactionData;
    if (data.intentMessage.value.V1) {
      const v1Data = data.intentMessage.value.V1;
      if (v1Data.kind && v1Data.kind.ProgrammableTransaction) {
        transactionData = {
          version: 1,
          // or extract from somewhere else if available
          sender: v1Data.sender,
          inputs: v1Data.kind.ProgrammableTransaction.inputs,
          commands: v1Data.kind.ProgrammableTransaction.commands,
          gasData: v1Data.gasData,
          expiration: v1Data.expiration,
          // Include signature information
          signatures: data.txSignatures,
          // Include original signed data for reference
          originalSignedData: data
        };
      }
    }
    if (transactionData) {
      return getTransactionData(transactionData);
    }
  }
  if (data && data.sender && data.inputs && data.commands && data.gasData) {
    let txDigest = null;
    if (data.commands && data.commands.length > 0 && data.commands[0] && "$kind" in data.commands[0]) {
      try {
        let txData = new TransactionDataBuilder(data);
        let txBytes = txData.build();
        txDigest = TransactionDataBuilder.getDigestFromBytes(txBytes);
      } catch (e) {
        try {
          let txData = new TransactionDataBuilder(data);
          let txBytes = txData.build();
          txDigest = TransactionDataBuilder.getDigestFromBytes(txBytes);
        } catch (e2) {
          console.log("error SenderSignedData", e2);
        }
      }
    }
    const normalized = {
      digest: txDigest,
      sender: data.sender,
      timestamp: null,
      // Create effects structure for compatibility
      effects: {
        status: { status: "pending" },
        gasUsed: {
          computationCost: "0",
          storageCost: "0",
          storageRebate: "0",
          nonRefundableStorageFee: "0"
        },
        gasEffects: {
          gasSummary: {
            computationCost: "0",
            storageCost: "0",
            storageRebate: "0",
            nonRefundableStorageFee: "0"
          }
        },
        balanceChanges: { nodes: [] },
        objectChanges: { nodes: [] },
        events: { nodes: [] }
      },
      // Map inputs and commands to expected paths for TransactionEffects component
      input: {
        transaction: {
          inputs: data.inputs,
          transactions: data.commands
          // commands are called transactions in this path
        },
        gasData: data.gasData
      },
      // Also map to decodedBCS format for consistency, if commands have $kind
      ...data.commands && data.commands[0] && data.commands[0].$kind ? {
        decodedBCS: {
          intentMessage: {
            value: {
              V1: {
                kind: {
                  ProgrammableTransaction: {
                    inputs: data.inputs,
                    commands: data.commands
                  }
                }
              }
            }
          }
        }
      } : {},
      // Include transaction data details
      transactionData: {
        version: data.version,
        sender: data.sender,
        inputs: data.inputs,
        commands: data.commands,
        gasData: data.gasData,
        expiration: data.expiration
      },
      // Include signature info if available
      signatures: data.signatures,
      // Include all original data
      ...data
    };
    return normalized;
  }
  if (data && data.jsonrpc && data.result) {
    const result = data.result;
    let objectChanges;
    if (result.objectChanges !== void 0) {
      objectChanges = result.objectChanges.map((change) => ({
        ...change,
        owner: normalizeOwner(change.owner)
      }));
    } else if (result.effects && (result.effects.created || result.effects.mutated)) {
      objectChanges = [
        ...(result.effects.created || []).map((obj) => ({
          type: "created",
          objectId: obj.reference?.objectId,
          version: obj.reference?.version,
          digest: obj.reference?.digest,
          owner: normalizeOwner(obj.owner),
          objectType: ""
        })),
        ...(result.effects.mutated || []).map((obj) => ({
          type: "mutated",
          objectId: obj.reference?.objectId,
          version: obj.reference?.version,
          digest: obj.reference?.digest,
          owner: normalizeOwner(obj.owner),
          objectType: ""
        }))
      ];
    } else {
      objectChanges = [];
    }
    if (result.effects && result.results) {
      const normalized2 = {
        // Map the fields to match what TransactionEffects expects
        digest: result.effects?.transactionDigest,
        sender: null,
        // Dev inspect doesn't have sender info
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
            timestamp: result.timestampMs ? typeof result.timestampMs === "string" ? parseInt(result.timestampMs) : result.timestampMs : null
          },
          // Map gas structure
          gasEffects: {
            gasSummary: result.effects?.gasUsed
          },
          // Map the arrays to the expected structure
          balanceChanges: {
            nodes: []
          },
          objectChanges: {
            nodes: objectChanges
          },
          events: {
            nodes: result.events || []
          }
        },
        // Include the original arrays at the top level too for compatibility
        objectChanges,
        balanceChanges: [],
        events: result.events || [],
        // Add dev inspect specific data
        devInspectResults: result.results,
        // Include other original data safely
        input: result.input,
        timestampMs: result.timestampMs,
        checkpoint: result.checkpoint
      };
      return normalized2;
    }
    const normalized = {
      // Map the fields to match what TransactionEffects expects
      digest: result.effects?.transactionDigest,
      sender: result.input?.sender,
      timestamp: null,
      // JSON-RPC format doesn't include timestamp
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
          sequenceNumber: typeof result.checkpoint === "string" || typeof result.checkpoint === "number" ? result.checkpoint : result.checkpoint?.sequenceNumber || null,
          timestamp: result.timestampMs ? typeof result.timestampMs === "string" ? parseInt(result.timestampMs) : result.timestampMs : null
        },
        // Map gas structure
        gasEffects: {
          gasSummary: result.effects?.gasUsed
        },
        // Map the arrays to the expected structure
        balanceChanges: {
          nodes: result.balanceChanges || []
        },
        objectChanges: {
          nodes: objectChanges
        },
        events: {
          nodes: result.events || []
        }
      },
      // Include the original arrays at the top level too for compatibility
      objectChanges,
      balanceChanges: result.balanceChanges || [],
      events: result.events || [],
      // Include other original data, but exclude potentially conflicting arrays
      input: result.input,
      timestampMs: result.timestampMs,
      checkpoint: result.checkpoint
    };
    return normalized;
  }
  if (data && data.effects) {
    let objectChanges;
    if (data.objectChanges !== void 0) {
      objectChanges = data.objectChanges.map((change) => ({
        ...change,
        owner: normalizeOwner(change.owner)
      }));
    } else if (data.effects && (data.effects.created || data.effects.mutated)) {
      objectChanges = [
        ...(data.effects.created || []).map((obj) => ({
          type: "created",
          objectId: obj.reference?.objectId,
          version: obj.reference?.version,
          digest: obj.reference?.digest,
          owner: normalizeOwner(obj.owner),
          objectType: ""
        })),
        ...(data.effects.mutated || []).map((obj) => ({
          type: "mutated",
          objectId: obj.reference?.objectId,
          version: obj.reference?.version,
          digest: obj.reference?.digest,
          owner: normalizeOwner(obj.owner),
          objectType: ""
        }))
      ];
    } else {
      objectChanges = [];
    }
    const normalized = {
      ...data,
      digest: data.digest || data.effects?.transactionDigest,
      sender: data?.transaction?.data?.sender || data.sender || data.input?.sender,
      objectChanges,
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
          sequenceNumber: typeof data.checkpoint === "string" || typeof data.checkpoint === "number" ? data.checkpoint : data.effects.checkpoint?.sequenceNumber || null,
          timestamp: data.timestampMs ? typeof data.timestampMs === "string" ? parseInt(data.timestampMs) : data.timestampMs : data.effects.checkpoint?.timestamp || null
        },
        gasEffects: data.effects.gasEffects || {
          gasSummary: data.effects?.gasUsed
        },
        objectChanges: {
          nodes: objectChanges
        },
        balanceChanges: {
          nodes: data.balanceChanges || []
        },
        events: {
          nodes: data.events || []
        }
      }
    };
    return normalized;
  }
  return data;
}
export {
  formatJsonWithCompactArrays as f,
  getTransactionData as g,
  isTransactionData as i,
  removeKindFields as r
};

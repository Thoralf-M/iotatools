var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { L as iotaBcs, N as fromB64, T as getSelectedNetworkConfig } from "/iota-utils/assets/index-C8-FAvgb.js";
import { g as graphql, I as IotaGraphQLClient } from "/iota-utils/assets/index-iNvvLVSQ.js";
class TransactionDataProcessor {
  constructor() {
    __publicField(this, "transactionData");
    this.transactionData = this.createEmptyTransactionData();
  }
  createEmptyTransactionData() {
    return {
      totalPTBs: 0,
      failedPTBs: 0,
      uniqueSenders: /* @__PURE__ */ new Set(),
      calledPackages: /* @__PURE__ */ new Set(),
      calledFunctions: /* @__PURE__ */ new Set(),
      publishedPackages: /* @__PURE__ */ new Map(),
      senderCounts: /* @__PURE__ */ new Map(),
      packageCounts: /* @__PURE__ */ new Map(),
      rawData: [],
      checkpointData: /* @__PURE__ */ new Map(),
      transactionsByCheckpoint: /* @__PURE__ */ new Map(),
      commandTypeStats: /* @__PURE__ */ new Map()
    };
  }
  resetData() {
    this.transactionData = this.createEmptyTransactionData();
  }
  processTransactionBatch(transactions) {
    for (const tx of transactions) {
      this.processTransactionBlock(tx);
    }
  }
  processTransactionBlock(tx) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
    this.transactionData.totalPTBs++;
    if (((_a = tx.effects) == null ? void 0 : _a.status) !== "SUCCESS") {
      this.transactionData.failedPTBs++;
    }
    let decodedData = null;
    if ((_c = (_b = tx.effects) == null ? void 0 : _b.transactionBlock) == null ? void 0 : _c.bcs) {
      try {
        decodedData = iotaBcs.SenderSignedData.parse(
          fromB64(tx.effects.transactionBlock.bcs)
        )[0];
      } catch (e2) {
        console.warn("Failed to decode BCS data for transaction:", tx.digest, e2);
      }
    }
    if (decodedData) {
      tx.decodedBCS = decodedData;
    }
    const checkpointSeq = (_e = (_d = tx.effects) == null ? void 0 : _d.checkpoint) == null ? void 0 : _e.sequenceNumber;
    const checkpointTimestamp = (_g = (_f = tx.effects) == null ? void 0 : _f.checkpoint) == null ? void 0 : _g.timestamp;
    if (checkpointSeq !== void 0 && checkpointSeq !== null && checkpointTimestamp) {
      if (!this.transactionData.checkpointData.has(checkpointSeq)) {
        this.transactionData.checkpointData.set(checkpointSeq, {
          sequenceNumber: checkpointSeq,
          timestamp: checkpointTimestamp,
          transactionCount: 0
        });
      }
      this.transactionData.checkpointData.get(checkpointSeq).transactionCount++;
      if (!this.transactionData.transactionsByCheckpoint.has(checkpointSeq)) {
        this.transactionData.transactionsByCheckpoint.set(checkpointSeq, []);
      }
      this.transactionData.transactionsByCheckpoint.get(checkpointSeq).push(tx);
    }
    let senderAddress = null;
    if ((_h = tx.sender) == null ? void 0 : _h.address) {
      senderAddress = tx.sender.address;
    } else if ((_k = (_j = (_i = decodedData == null ? void 0 : decodedData.intentMessage) == null ? void 0 : _i.value) == null ? void 0 : _j.V1) == null ? void 0 : _k.sender) {
      senderAddress = decodedData.intentMessage.value.V1.sender;
    }
    if (senderAddress) {
      this.transactionData.uniqueSenders.add(senderAddress);
      const currentCount = this.transactionData.senderCounts.get(senderAddress) || 0;
      this.transactionData.senderCounts.set(senderAddress, currentCount + 1);
    }
    this.extractPTBCommands(decodedData, tx.digest);
    this.extractPublishedPackages(tx, senderAddress);
    this.transactionData.rawData.push(tx);
  }
  extractPTBCommands(decodedData, txDigest) {
    var _a, _b, _c, _d, _e;
    let ptbCommands = [];
    if ((_e = (_d = (_c = (_b = (_a = decodedData == null ? void 0 : decodedData.intentMessage) == null ? void 0 : _a.value) == null ? void 0 : _b.V1) == null ? void 0 : _c.kind) == null ? void 0 : _d.ProgrammableTransaction) == null ? void 0 : _e.commands) {
      ptbCommands = decodedData.intentMessage.value.V1.kind.ProgrammableTransaction.commands;
    }
    for (const command of ptbCommands) {
      const commandType = Object.keys(command)[0];
      if (commandType) {
        let stats = this.transactionData.commandTypeStats.get(commandType);
        if (!stats) {
          stats = { count: 0, digests: [] };
          this.transactionData.commandTypeStats.set(commandType, stats);
        }
        stats.count++;
        if (txDigest && !stats.digests.includes(txDigest) && stats.digests.length < 20) {
          stats.digests.push(txDigest);
        }
      }
      if (command.MoveCall) {
        const moveCall = command.MoveCall;
        const packageId = moveCall.package;
        const module = moveCall.module;
        const functionName = moveCall.function;
        if (packageId) {
          this.transactionData.calledPackages.add(packageId);
          const currentPackageCount = this.transactionData.packageCounts.get(packageId) || 0;
          this.transactionData.packageCounts.set(packageId, currentPackageCount + 1);
          const fullFunctionName = `${packageId}::${module}::${functionName}`;
          this.transactionData.calledFunctions.add(fullFunctionName);
        }
      }
    }
  }
  extractPublishedPackages(tx, senderAddress) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r;
    let ptbCommands = [];
    const decodedData = tx.decodedBCS;
    if ((_e = (_d = (_c = (_b = (_a = decodedData == null ? void 0 : decodedData.intentMessage) == null ? void 0 : _a.value) == null ? void 0 : _b.V1) == null ? void 0 : _c.kind) == null ? void 0 : _d.ProgrammableTransaction) == null ? void 0 : _e.commands) {
      ptbCommands = decodedData.intentMessage.value.V1.kind.ProgrammableTransaction.commands;
    }
    const hasPublishCommand = ptbCommands.some((cmd) => cmd.Publish);
    if (!hasPublishCommand || !senderAddress) {
      return;
    }
    const objectChanges = ((_g = (_f = tx.effects) == null ? void 0 : _f.objectChanges) == null ? void 0 : _g.nodes) || [];
    const txId = tx.digest || "";
    for (const change of objectChanges) {
      if ((_k = (_j = (_i = (_h = change.outputState) == null ? void 0 : _h.asMoveObject) == null ? void 0 : _i.contents) == null ? void 0 : _j.json) == null ? void 0 : _k.package) {
        if (!((_o = (_n = (_m = (_l = change.outputState) == null ? void 0 : _l.asMoveObject) == null ? void 0 : _m.contents) == null ? void 0 : _n.json) == null ? void 0 : _o.package.startsWith("0x"))) {
          continue;
        }
        const packageData = change.outputState.asMoveObject.contents.json;
        const publishedPackage = {
          packageId: packageData.package,
          sender: senderAddress,
          version: packageData.version || "1",
          txId
        };
        this.transactionData.publishedPackages.set(packageData.package, publishedPackage);
      }
      if ((_r = (_q = (_p = change.outputState) == null ? void 0 : _p.asMovePackage) == null ? void 0 : _q.modules) == null ? void 0 : _r.nodes) {
        const packageId = change.address || change.idCreated;
        if (packageId && packageId.startsWith("0x")) {
          const moduleNames = change.outputState.asMovePackage.modules.nodes.map((module) => module.name).filter((name) => name);
          const existingPackage = this.transactionData.publishedPackages.get(packageId);
          if (existingPackage) {
            existingPackage.modules = moduleNames;
          } else {
            const publishedPackage = {
              packageId,
              sender: senderAddress,
              version: "1",
              txId,
              modules: moduleNames
            };
            this.transactionData.publishedPackages.set(packageId, publishedPackage);
          }
        }
      }
    }
  }
  createDisplayData(checkpointRange) {
    var _a, _b, _c, _d, _e, _f;
    const functionMap = /* @__PURE__ */ new Map();
    for (const tx of this.transactionData.rawData) {
      let ptbCommands = [];
      if ((_f = (_e = (_d = (_c = (_b = (_a = tx.decodedBCS) == null ? void 0 : _a.intentMessage) == null ? void 0 : _b.value) == null ? void 0 : _c.V1) == null ? void 0 : _d.kind) == null ? void 0 : _e.ProgrammableTransaction) == null ? void 0 : _f.commands) {
        ptbCommands = tx.decodedBCS.intentMessage.value.V1.kind.ProgrammableTransaction.commands;
      }
      for (const command of ptbCommands) {
        if (command.MoveCall) {
          const moveCall = command.MoveCall;
          const packageId = moveCall.package;
          const module = moveCall.module;
          const functionName = moveCall.function;
          if (packageId && module && functionName) {
            const fullFunctionName = `${packageId}::${module}::${functionName}`;
            if (!functionMap.has(fullFunctionName)) {
              functionMap.set(fullFunctionName, {
                package: packageId,
                module,
                function: functionName,
                fullName: fullFunctionName,
                callCount: 0,
                transactionIds: []
              });
            }
            const funcData = functionMap.get(fullFunctionName);
            funcData.callCount++;
            if (!funcData.transactionIds.includes(tx.digest) || funcData.transactionIds.length > 20) {
              funcData.transactionIds.push(tx.digest);
            }
          }
        }
      }
    }
    const commandTypeStats = Array.from(this.transactionData.commandTypeStats.entries()).map(([type, stat]) => ({
      type,
      count: stat.count,
      digests: stat.digests.slice(0, 20)
    })).sort((a, b) => b.count - a.count || a.type.localeCompare(b.type));
    return {
      totalPTBs: this.transactionData.totalPTBs,
      failedPTBs: this.transactionData.failedPTBs,
      uniqueSendersCount: this.transactionData.uniqueSenders.size,
      calledPackagesCount: this.transactionData.calledPackages.size,
      calledFunctionsCount: this.transactionData.calledFunctions.size,
      publishedPackagesCount: this.transactionData.publishedPackages.size,
      uniqueSendersList: Array.from(this.transactionData.senderCounts.entries()).map(([address, txCount]) => ({ address, txCount })).sort((a, b) => b.txCount - a.txCount || a.address.localeCompare(b.address)),
      calledPackagesList: Array.from(this.transactionData.packageCounts.entries()).map(([packageAddress, callCount]) => ({ package: packageAddress, callCount })).sort((a, b) => b.callCount - a.callCount || a.package.localeCompare(b.package)),
      publishedPackagesList: Array.from(this.transactionData.publishedPackages.values()).sort(
        (a, b) => a.packageId.localeCompare(b.packageId)
      ),
      calledFunctionsList: Array.from(functionMap.values()).sort(
        (a, b) => b.callCount - a.callCount || a.fullName.localeCompare(b.fullName)
      ),
      checkpointRange,
      checkpointData: Array.from(this.transactionData.checkpointData.values()).sort(
        (a, b) => a.sequenceNumber - b.sequenceNumber
      ),
      transactionsByCheckpoint: this.transactionData.transactionsByCheckpoint,
      commandTypeStats
    };
  }
  getCheckpointTransactions(checkpointNum) {
    const sequenceNumber = parseInt(checkpointNum.toString());
    const transactions = this.transactionData.transactionsByCheckpoint.get(sequenceNumber) || [];
    return transactions.map((tx) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i;
      return {
        digest: tx.digest,
        sender: ((_a = tx.sender) == null ? void 0 : _a.address) || ((_e = (_d = (_c = (_b = tx.decodedBCS) == null ? void 0 : _b.intentMessage) == null ? void 0 : _c.value) == null ? void 0 : _d.V1) == null ? void 0 : _e.sender) || "Unknown",
        gasUsed: ((_g = (_f = tx.effects) == null ? void 0 : _f.gasEffects) == null ? void 0 : _g.gasUsed) || null,
        timestamp: ((_i = (_h = tx.effects) == null ? void 0 : _h.checkpoint) == null ? void 0 : _i.timestamp) || null,
        effects: tx.effects || null,
        decodedBCS: tx.decodedBCS || null
      };
    });
  }
  calculateProgress(checkpointRange) {
    let minCheckpointSeen = null;
    let maxCheckpointSeen = null;
    for (const checkpointSeq of this.transactionData.checkpointData.keys()) {
      if (minCheckpointSeen === null || checkpointSeq < minCheckpointSeen) {
        minCheckpointSeen = checkpointSeq;
      }
      if (maxCheckpointSeen === null || checkpointSeq > maxCheckpointSeen) {
        maxCheckpointSeen = checkpointSeq;
      }
    }
    let progressBasedOnRange = 0;
    if (maxCheckpointSeen !== null) {
      progressBasedOnRange = Math.max(0, maxCheckpointSeen - checkpointRange.first + 1);
    }
    const checkpointRangeSize = checkpointRange.last - checkpointRange.first + 1;
    return {
      processedCheckpoints: progressBasedOnRange,
      totalCheckpoints: checkpointRangeSize,
      minCheckpointSeen,
      maxCheckpointSeen
    };
  }
  reset() {
    this.resetData();
  }
  gettotalPTBs() {
    return this.transactionData.totalPTBs;
  }
}
class GraphQLDataFetcher {
  constructor() {
  }
  async queryGraphQl(query, variables = {}) {
    const options = {
      query: graphql(query),
      variables
    };
    return new IotaGraphQLClient({
      url: getSelectedNetworkConfig().graphql
    }).query(options);
  }
  async getCurrentEpoch() {
    var _a, _b;
    try {
      const currentEpochQuery = `query {
                epoch {
                    epochId
                }
            }`;
      const result = await this.queryGraphQl(currentEpochQuery);
      if (result.errors) {
        console.error("Error fetching current epoch:", result.errors);
        return null;
      }
      const currentEpochId = (_b = (_a = result.data) == null ? void 0 : _a.epoch) == null ? void 0 : _b.epochId;
      return currentEpochId ? currentEpochId.toString() : null;
    } catch (err) {
      console.error("Error fetching current epoch:", err);
      return null;
    }
  }
  async getCheckpointRangeForEpoch(epochNum) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
    const checkpointRangeQuery = `query ($epochId: UInt53!) {
            epoch(id: $epochId) {
                checkpoints(first: 1) {
                    nodes {
                        sequenceNumber
                    }
                }
                lastCheckpoints: checkpoints(last: 1) {
                    nodes {
                        sequenceNumber
                    }
                }
            }
        }`;
    const result = await this.queryGraphQl(checkpointRangeQuery, { epochId: epochNum });
    if (result.errors) {
      throw new Error(
        `GraphQL Error: ${result.errors.map((e) => e.message).join(", ")}`
      );
    }
    const firstCheckpoint = (_e = (_d = (_c = (_b = (_a = result.data) == null ? void 0 : _a.epoch) == null ? void 0 : _b.checkpoints) == null ? void 0 : _c.nodes) == null ? void 0 : _d[0]) == null ? void 0 : _e.sequenceNumber;
    const lastCheckpoint = (_j = (_i = (_h = (_g = (_f = result.data) == null ? void 0 : _f.epoch) == null ? void 0 : _g.lastCheckpoints) == null ? void 0 : _h.nodes) == null ? void 0 : _i[0]) == null ? void 0 : _j.sequenceNumber;
    if (!firstCheckpoint || !lastCheckpoint) {
      throw new Error(`Could not find checkpoint range for epoch ${epochNum}`);
    }
    return { first: firstCheckpoint, last: lastCheckpoint };
  }
  async fetchTransactionBatch(checkpointRange, batchSize = 50, cursor, inputObject, functionFilter) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const cursorSection = cursor ? `, after: "${cursor}"` : "";
    const filterParts = [
      `afterCheckpoint: ${checkpointRange.first}`,
      `beforeCheckpoint: ${checkpointRange.last}`,
      `kind: PROGRAMMABLE_TX`
    ];
    if (inputObject && inputObject.trim()) {
      filterParts.push(`inputObject: "${inputObject.trim()}"`);
    }
    if (functionFilter && functionFilter.trim()) {
      filterParts.push(`function: "${functionFilter.trim()}"`);
    }
    const filterString = filterParts.join(", ");
    const hasOptionalFilters = inputObject && inputObject.trim() || functionFilter && functionFilter.trim();
    const scanLimitSection = hasOptionalFilters ? "scanLimit: 100000000," : "";
    const txQuery = `query {
                transactionBlocks(
                    ${scanLimitSection}
                    filter: {
                        ${filterString}
                    }
                    first: ${batchSize}${cursorSection}
                ) {
                    nodes {
                        digest
                        sender {
                            address
                        }
                        effects {
                            checkpoint {
                                sequenceNumber
                                timestamp
                            }
                            status
                            balanceChanges{
                                nodes{
                                    owner{
                                        address
                                    }
                                    coinType{
                                        repr
                                    }
                                    amount
                                }
                            }
                            gasEffects{
                              gasSummary{
                                storageCost
                                storageRebate
                                computationCost
                              }
                            }
                            objectChanges {
                                nodes {
                                    idDeleted
                                    idCreated
                                    address
                                    inputState {
                                      asMoveObject {
                                        contents {
                                          json
                                        }
                                      }
                                    }
                                    outputState {
                                        asMoveObject {
                                            contents {
                                                json
                                            }
                                        }
                                        asMovePackage {
                                            modules {
                                                nodes {
                                                    name
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            events {
                              nodes {
                                data
                                sendingModule {
                                  package {
                                    address
                                  }
                                }
                              }
                            }
                            transactionBlock {
                                bcs
                            }
                        }
                    }
                    pageInfo {
                        hasNextPage
                        endCursor
                    }
                }
            }`;
    const result = await this.queryGraphQl(txQuery);
    if (result.errors) {
      throw new Error(
        `GraphQL Error: ${result.errors.map((e) => e.message).join(", ")}`
      );
    }
    const transactionBlocks = ((_b = (_a = result.data) == null ? void 0 : _a.transactionBlocks) == null ? void 0 : _b.nodes) || [];
    const hasNextPage = ((_e = (_d = (_c = result.data) == null ? void 0 : _c.transactionBlocks) == null ? void 0 : _d.pageInfo) == null ? void 0 : _e.hasNextPage) || false;
    const endCursor = (_h = (_g = (_f = result.data) == null ? void 0 : _f.transactionBlocks) == null ? void 0 : _g.pageInfo) == null ? void 0 : _h.endCursor;
    return {
      transactions: transactionBlocks,
      hasNextPage,
      endCursor
    };
  }
  async *fetchAllTransactionBlocks(checkpointRange, maxTransactions, inputObject, functionFilter) {
    let hasNextPage = true;
    let cursor = null;
    let totalFetched = 0;
    while (hasNextPage && (!maxTransactions || totalFetched < maxTransactions)) {
      const remainingToFetch = maxTransactions ? maxTransactions - totalFetched : 50;
      const batchSize = Math.min(50, remainingToFetch);
      const batchResult = await this.fetchTransactionBatch(
        checkpointRange,
        batchSize,
        cursor,
        inputObject,
        functionFilter
      );
      const transactionsToProcess = maxTransactions ? batchResult.transactions.slice(0, remainingToFetch) : batchResult.transactions;
      totalFetched += transactionsToProcess.length;
      hasNextPage = batchResult.hasNextPage;
      cursor = batchResult.endCursor;
      const isComplete = !hasNextPage || maxTransactions !== void 0 && totalFetched >= maxTransactions;
      yield {
        transactions: transactionsToProcess,
        isComplete,
        totalFetched,
        hasMore: hasNextPage && (!maxTransactions || totalFetched < maxTransactions)
      };
      if (maxTransactions && totalFetched >= maxTransactions) {
        break;
      }
    }
  }
}
class EpochPTBAnalyzer {
  constructor() {
    __publicField(this, "fetcher");
    __publicField(this, "processor");
    __publicField(this, "stopRequested", false);
    this.fetcher = new GraphQLDataFetcher();
    this.processor = new TransactionDataProcessor();
  }
  requestStop() {
    this.stopRequested = true;
  }
  resetStopFlag() {
    this.stopRequested = false;
  }
  async getCurrentEpoch() {
    return this.fetcher.getCurrentEpoch();
  }
  async getCheckpointRangeForEpoch(epochNum) {
    return this.fetcher.getCheckpointRangeForEpoch(epochNum);
  }
  getCheckpointTransactions(checkpointNum, displayData) {
    return this.processor.getCheckpointTransactions(checkpointNum);
  }
  async resolveCheckpointRange(epoch, startCheckpoint, endCheckpoint) {
    const epochStr = epoch == null ? void 0 : epoch.toString();
    const startCheckpointStr = startCheckpoint == null ? void 0 : startCheckpoint.toString();
    const endCheckpointStr = endCheckpoint == null ? void 0 : endCheckpoint.toString();
    if (epochStr && epochStr.trim() !== "") {
      const epochNum = parseInt(epochStr.trim());
      if (isNaN(epochNum) || epochNum < 0) {
        throw new Error("Please enter a valid positive number for epoch");
      }
      return await this.fetcher.getCheckpointRangeForEpoch(epochNum);
    } else if (startCheckpointStr && endCheckpointStr) {
      const startNum = parseInt(startCheckpointStr.trim());
      const endNum = parseInt(endCheckpointStr.trim());
      if (isNaN(startNum) || isNaN(endNum) || startNum < 0 || endNum < 0) {
        throw new Error("Please enter valid positive numbers for checkpoint range");
      }
      if (startNum > endNum) {
        throw new Error("Start checkpoint must be less than or equal to end checkpoint");
      }
      return { first: startNum, last: endNum };
    } else {
      throw new Error("Please enter either an epoch number or a checkpoint range");
    }
  }
  async *fetchTransactionBlocksWithProgress(checkpointRange, maxTransactions, inputObject, functionFilter) {
    this.processor.reset();
    for await (const fetchResult of this.fetcher.fetchAllTransactionBlocks(
      checkpointRange,
      maxTransactions,
      inputObject,
      functionFilter
    )) {
      if (this.stopRequested) {
        console.log("Stopping fetchTransactionBlocksWithProgress due to user request");
        break;
      }
      this.processor.processTransactionBatch(fetchResult.transactions);
      const progress = this.processor.calculateProgress(checkpointRange);
      const displayData = this.processor.createDisplayData(checkpointRange);
      if (fetchResult.isComplete) {
        console.log(
          `✓ Complete: Covered ${progress.processedCheckpoints} checkpoints in range, ${fetchResult.totalFetched} total transactions`
        );
      } else {
        const progressPercentage = Math.round(
          progress.processedCheckpoints / progress.totalCheckpoints * 100
        );
        console.log(
          `Progress: ${progress.processedCheckpoints}/${progress.totalCheckpoints} checkpoints in range (${progressPercentage}%), ${fetchResult.totalFetched} transactions`
        );
      }
      yield {
        data: displayData,
        isComplete: fetchResult.isComplete,
        processedTransactions: fetchResult.totalFetched,
        processedCheckpoints: progress.processedCheckpoints,
        totalCheckpoints: progress.totalCheckpoints
      };
    }
  }
  async fetchAllTransactionBlocks(epoch, startCheckpoint, endCheckpoint, onProgress, inputObject, functionFilter) {
    this.resetStopFlag();
    const checkpointRange = await this.resolveCheckpointRange(
      epoch,
      startCheckpoint,
      endCheckpoint
    );
    let finalData = null;
    for await (const progress of this.fetchTransactionBlocksWithProgress(
      checkpointRange,
      void 0,
      inputObject,
      functionFilter
    )) {
      if (this.stopRequested) {
        console.log("Stopping transaction fetch due to user request");
        break;
      }
      finalData = progress.data;
      if (onProgress) {
        onProgress(
          progress.data,
          progress.isComplete,
          progress.processedTransactions,
          progress.processedCheckpoints,
          progress.totalCheckpoints
        );
      }
    }
    return finalData;
  }
  async fetchLimitedTransactionBlocks(transactionLimit, epoch, startCheckpoint, endCheckpoint, onProgress, inputObject, functionFilter) {
    this.resetStopFlag();
    const checkpointRange = await this.resolveCheckpointRange(
      epoch,
      startCheckpoint,
      endCheckpoint
    );
    let finalData = null;
    for await (const progress of this.fetchTransactionBlocksWithProgress(
      checkpointRange,
      transactionLimit,
      inputObject,
      functionFilter
    )) {
      if (this.stopRequested) {
        console.log("Stopping limited transaction fetch due to user request");
        break;
      }
      finalData = progress.data;
      if (onProgress) {
        onProgress(
          progress.data,
          progress.isComplete,
          progress.processedTransactions,
          progress.processedCheckpoints,
          progress.totalCheckpoints
        );
      }
    }
    return finalData;
  }
}
export {
  EpochPTBAnalyzer as E
};

import { r as getSelectedNetworkConfig, t as getClient } from "./client-BTFoHz6u.js";
import { t as IotaGraphQLClient } from "./client-CmDrt-ez.js";
//#region src/lib/pages/txs/fetchTransactions.ts
async function fetchTransactionByDigest(digest) {
	try {
		const tx = await getClient().getTransactionBlock({
			digest,
			options: {
				showEffects: true,
				showInput: true,
				showEvents: true,
				showObjectChanges: true
			}
		});
		if (!tx) return null;
		const checkpoint = tx.checkpoint ? parseInt(tx.checkpoint) : 0;
		const timestamp = tx.timestampMs || "";
		const sender = tx.transaction?.data?.sender || "";
		const createdObjects = [];
		const mutatedObjects = [];
		const deletedObjects = [];
		const inputObjects = [];
		const recipients = [];
		const objectTypeMap = /* @__PURE__ */ new Map();
		if (tx.objectChanges) {
			for (const change of tx.objectChanges) if ((change.type === "created" || change.type === "mutated") && "objectId" in change && "objectType" in change) objectTypeMap.set(change.objectId, change.objectType);
		}
		if (tx.transaction?.data?.transaction) {
			const txData = tx.transaction.data.transaction;
			if (txData.inputs) {
				for (const input of txData.inputs) if (input.Object?.ImmOrOwnedObject) {
					const obj = input.Object.ImmOrOwnedObject;
					inputObjects.push({
						objectId: obj.objectId,
						objectType: obj.objectType || objectTypeMap.get(obj.objectId) || "Unknown",
						version: obj.version || "",
						isGas: false
					});
				}
			}
		}
		if (tx.transaction?.data?.gasData?.payment) for (const gasCoin of tx.transaction.data.gasData.payment) inputObjects.push({
			objectId: gasCoin.objectId,
			objectType: objectTypeMap.get(gasCoin.objectId) || "Unknown",
			version: gasCoin.version || "",
			isGas: true
		});
		if (tx.objectChanges) {
			for (const change of tx.objectChanges) if (change.type === "created" && "objectId" in change && "objectType" in change) {
				createdObjects.push({
					objectId: change.objectId,
					objectType: change.objectType,
					version: change.version || ""
				});
				if (change.recipient && change.recipient !== sender) recipients.push(change.recipient);
			} else if (change.type === "mutated" && "objectId" in change && "objectType" in change) mutatedObjects.push({
				objectId: change.objectId,
				objectType: change.objectType,
				previousVersion: change.previousVersion || "",
				version: change.version || ""
			});
			else if (change.type === "deleted" && "objectId" in change) deletedObjects.push(change.objectId);
		}
		return {
			digest,
			sender,
			checkpoint,
			timestamp,
			createdObjects,
			mutatedObjects,
			deletedObjects,
			inputObjects,
			recipients: [...new Set(recipients)],
			rawData: tx
		};
	} catch (e) {
		console.error(`Failed to fetch transaction ${digest}:`, e);
		return null;
	}
}
var MAX_SCAN_LIMIT = 2e4;
async function fetchTransactionsWithFilter(filterParts, variables, options, scanLimit) {
	const graphqlClient = new IotaGraphQLClient({ url: getSelectedNetworkConfig().graphql });
	const isNewest = options.orderBy === "newest";
	const direction = isNewest ? "last" : "first";
	const cursorParam = isNewest ? "before" : "after";
	const cursorSection = options.cursor ? `, ${cursorParam}: "${options.cursor}"` : "";
	const filterStr = `{ ${filterParts.join(", ")} }`;
	const scanLimitStr = scanLimit ? `, scanLimit: ${scanLimit}` : "";
	const variableDeclarations = ["$limit: Int!"];
	if (variables.address !== void 0) variableDeclarations.push("$address: IotaAddress!");
	if (variables.objectId !== void 0) variableDeclarations.push("$objectId: IotaAddress!");
	const variableDeclarationsStr = variableDeclarations.join(", ");
	const data = (await graphqlClient.query({
		query: `
            query GetTransactions(${variableDeclarationsStr}) {
                transactionBlocks(
                    filter: ${filterStr}
                    ${direction}: $limit${cursorSection}${scanLimitStr}
                ) {
                    pageInfo {
                        ${isNewest ? "hasPreviousPage" : "hasNextPage"}
                        ${isNewest ? "startCursor" : "endCursor"}
                    }
                    nodes {
                        digest
                    }
                }
            }
        `,
		variables: {
			limit: options.limit,
			...variables
		}
	})).data;
	const digests = (data?.transactionBlocks?.nodes?.map((n) => n.digest).filter(Boolean) || []).slice(0, options.limit);
	const hasMore = data?.transactionBlocks?.pageInfo?.[isNewest ? "hasPreviousPage" : "hasNextPage"] || false;
	const nextCursor = data?.transactionBlocks?.pageInfo?.[isNewest ? "startCursor" : "endCursor"] || null;
	const txPromises = digests.map((digest) => fetchTransactionByDigest(digest));
	return {
		txs: (await Promise.all(txPromises)).filter((tx) => tx !== null),
		nextCursor,
		hasMore
	};
}
async function fetchTransactionsForAddress(address, options) {
	const filterParts = [`sentAddress: $address`];
	if (options.afterCheckpoint && options.afterCheckpoint.trim()) filterParts.push(`afterCheckpoint: ${parseInt(options.afterCheckpoint)}`);
	if (options.beforeCheckpoint && options.beforeCheckpoint.trim()) filterParts.push(`beforeCheckpoint: ${parseInt(options.beforeCheckpoint)}`);
	if (options.combineFunctionFilter && options.functionFilter && options.functionFilter.trim()) filterParts.push(`function: "${options.functionFilter.trim()}"`);
	const scanLimit = options.combineFunctionFilter && options.functionFilter && options.functionFilter.trim() ? MAX_SCAN_LIMIT : void 0;
	return fetchTransactionsWithFilter(filterParts, { address }, options, scanLimit);
}
async function fetchTransactionsByInputObject(objectId, options) {
	const filterParts = [`inputObject: $objectId`];
	if (options.afterCheckpoint && options.afterCheckpoint.trim()) filterParts.push(`afterCheckpoint: ${parseInt(options.afterCheckpoint)}`);
	if (options.beforeCheckpoint && options.beforeCheckpoint.trim()) filterParts.push(`beforeCheckpoint: ${parseInt(options.beforeCheckpoint)}`);
	if (options.combineFunctionFilter && options.functionFilter && options.functionFilter.trim()) filterParts.push(`function: "${options.functionFilter.trim()}"`);
	const scanLimit = options.combineFunctionFilter && options.functionFilter && options.functionFilter.trim() ? MAX_SCAN_LIMIT : void 0;
	return fetchTransactionsWithFilter(filterParts, { objectId }, options, scanLimit);
}
async function fetchTransactionsByFunction(options) {
	const filterParts = [`kind: PROGRAMMABLE_TX`, `function: "${options.functionFilter.trim()}"`];
	if (options.afterCheckpoint && options.afterCheckpoint.trim()) filterParts.push(`afterCheckpoint: ${parseInt(options.afterCheckpoint)}`);
	if (options.beforeCheckpoint && options.beforeCheckpoint.trim()) filterParts.push(`beforeCheckpoint: ${parseInt(options.beforeCheckpoint)}`);
	return fetchTransactionsWithFilter(filterParts, {}, options, MAX_SCAN_LIMIT);
}
async function fetchRecentTransactions(options) {
	const filterParts = [`kind: PROGRAMMABLE_TX`];
	if (options.afterCheckpoint && options.afterCheckpoint.trim()) filterParts.push(`afterCheckpoint: ${parseInt(options.afterCheckpoint)}`);
	if (options.beforeCheckpoint && options.beforeCheckpoint.trim()) filterParts.push(`beforeCheckpoint: ${parseInt(options.beforeCheckpoint)}`);
	return fetchTransactionsWithFilter(filterParts, {}, options);
}
//#endregion
export { fetchTransactionsForAddress as a, fetchTransactionsByInputObject as i, fetchTransactionByDigest as n, fetchTransactionsByFunction as r, fetchRecentTransactions as t };

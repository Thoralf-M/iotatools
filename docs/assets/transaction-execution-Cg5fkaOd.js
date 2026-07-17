import { Ct as get, Tt as writable } from "./disclose-version-CpEJO7r1.js";
import { n as getSelectedChain, t as getClient } from "./client-BTFoHz6u.js";
import { Q as toBase64 } from "./keypair-DsT3ivIR.js";
import { i as requireMainnetTransactionConfirmation } from "./mainnet-transaction-confirmation-bplSEzLB.js";
import { f as getActiveWallet, t as activeAddress } from "./signer-data-D1Egmbld.js";
//#region src/lib/utils/shared-in-memory.ts
var TransactionExecution = /* @__PURE__ */ function(TransactionExecution) {
	TransactionExecution["DevInspect"] = "dev-inspect (simulation, free)";
	TransactionExecution["DryRun"] = "dry-run (simulation, free)";
	TransactionExecution["Send"] = "send (transaction, costs gas)";
	TransactionExecution["Prepare"] = "prepare tx bytes (free)";
	return TransactionExecution;
}({});
var sharedTransactionExecution = writable("dry-run (simulation, free)");
//#endregion
//#region src/lib/utils/transaction-execution.ts
async function executeTransaction(transaction, options = {
	showEffects: true,
	showObjectChanges: true,
	showBalanceChanges: true
}, modeOverride) {
	const client = getClient();
	const executionMode = modeOverride ?? get(sharedTransactionExecution);
	const senderAddress = get(activeAddress);
	transaction.setSenderIfNotSet(senderAddress);
	const txSenderAddress = transaction.getData().sender ?? senderAddress;
	switch (executionMode) {
		case TransactionExecution.DevInspect: return client.devInspectTransactionBlock({
			sender: txSenderAddress,
			transactionBlock: transaction
		});
		case TransactionExecution.DryRun:
			let transactionBlock = await transaction.build({ client });
			return client.dryRunTransactionBlock({ transactionBlock });
		case TransactionExecution.Send:
			const wallet = getActiveWallet();
			if (!wallet) throw new Error("No active wallet available");
			await requireMainnetTransactionConfirmation(transaction);
			return wallet.signAndExecuteTransaction({
				transaction,
				options,
				chain: getSelectedChain(),
				account: { address: txSenderAddress }
			});
		case TransactionExecution.Prepare:
			let json = JSON.parse(await transaction.toJSON());
			if (transaction.getData().gasData.price == 0) {
				let referenceGasPrice = await client.getReferenceGasPrice();
				transaction.setGasPrice(referenceGasPrice);
			}
			if (transaction.getData().gasData.budget == 0) {
				let gas = await calculateGasFee(transaction);
				transaction.setGasBudget(BigInt(gas));
			}
			return {
				json,
				transactionBytes: toBase64(await transaction.build({ client }))
			};
		default: throw new Error(`Unknown transaction execution mode: ${executionMode}`);
	}
}
var calculateGasFee = async (transaction) => {
	const client = getClient();
	const txBytes = await transaction.build({ client });
	return getGasSummary(await client.dryRunTransactionBlock({ transactionBlock: txBytes }))?.totalGas ?? transaction.getData().gasData.budget;
};
function getGasSummary(transaction) {
	const { effects } = transaction;
	if (!effects) return null;
	const totalGas = getTotalGasUsed(effects);
	let sender = void 0;
	let owner = "";
	let gasData = {};
	if ("transaction" in transaction && transaction.transaction?.data) {
		sender = transaction.transaction?.data.sender;
		gasData = transaction.transaction.data.gasData;
	} else if ("input" in transaction) {
		sender = transaction.input.sender;
		gasData = transaction.input.gasData;
	}
	owner = gasData?.owner ?? "";
	return {
		...effects.gasUsed,
		...gasData,
		owner,
		totalGas: totalGas?.toString(),
		isSponsored: !!owner && !!sender && owner !== sender,
		gasUsed: transaction?.effects.gasUsed
	};
}
function getTotalGasUsed(effects) {
	const gasSummary = effects?.gasUsed;
	return gasSummary ? BigInt(gasSummary.computationCost) + BigInt(gasSummary.storageCost) - BigInt(gasSummary.storageRebate) : void 0;
}
//#endregion
export { TransactionExecution as n, sharedTransactionExecution as r, executeTransaction as t };

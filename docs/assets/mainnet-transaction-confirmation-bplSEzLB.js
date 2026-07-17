import { Tt as writable } from "./disclose-version-CpEJO7r1.js";
import { r as getSelectedNetworkConfig } from "./client-BTFoHz6u.js";
//#region src/lib/utils/mainnet-transaction-confirmation.ts
var pendingMainnetTransactionConfirmation = writable(null);
var pendingResolver = null;
async function requireMainnetTransactionConfirmation(transaction) {
	if (getSelectedNetworkConfig().name !== "mainnet") return;
	if (pendingResolver) throw new Error("Another transaction confirmation is already in progress");
	let transactionData = transaction;
	try {
		transactionData = JSON.parse(await transaction.toJSON());
	} catch {}
	const confirmed = await new Promise((resolve) => {
		pendingResolver = resolve;
		pendingMainnetTransactionConfirmation.set({ transactionData });
	});
	pendingResolver = null;
	pendingMainnetTransactionConfirmation.set(null);
	if (!confirmed) throw new Error("Transaction cancelled by user");
}
function confirmMainnetTransaction() {
	if (pendingResolver) pendingResolver(true);
}
function cancelMainnetTransaction() {
	if (pendingResolver) pendingResolver(false);
}
//#endregion
export { requireMainnetTransactionConfirmation as i, confirmMainnetTransaction as n, pendingMainnetTransactionConfirmation as r, cancelMainnetTransaction as t };

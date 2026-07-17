//#region src/lib/utils/explorer-links.ts
/**
* Generate explorer links for different types of blockchain entities
*/
function generateExplorerLink(network, type, id) {
	const networkParam = encodeURIComponent(network.indexer);
	return `${network.explorer}/${type}/${id}?network=${networkParam}`;
}
/**
* Generate a transaction block explorer link
*/
function getTransactionLink(network, txId) {
	return generateExplorerLink(network, "txBlock", txId);
}
/**
* Generate an object explorer link
*/
function getObjectLink(network, objectId) {
	return generateExplorerLink(network, "object", objectId);
}
/**
* Generate an address explorer link
*/
function getAddressLink(network, address) {
	return generateExplorerLink(network, "address", address);
}
//#endregion
export { getObjectLink as n, getTransactionLink as r, getAddressLink as t };

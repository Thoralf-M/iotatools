function generateExplorerLink(network, type, id) {
  const networkParam = encodeURIComponent(network.indexer);
  return `${network.explorer}/${type}/${id}?network=${networkParam}`;
}
function getTransactionLink(network, txId) {
  return generateExplorerLink(network, "txBlock", txId);
}
function getObjectLink(network, objectId) {
  return generateExplorerLink(network, "object", objectId);
}
function getAddressLink(network, address) {
  return generateExplorerLink(network, "address", address);
}
export {
  getTransactionLink as a,
  getAddressLink as b,
  getObjectLink as g
};
